/**
 * universal-symbolics-harmonizer.ts
 * 
 * Core grammar harmonization engine for Universal Symbolics.
 * Provides bidirectional translation between all symbolic grammars.
 */

import {
  ModelVendor,
  SymbolicPrimitive,
  GrammarStyle,
  SymbolicOperation,
  VendorImplementation,
  SYMBOLIC_RUNTIME_SCHEMA
} from './universal-symbolics-runtime';

import { SymbolicsRegistry } from './universal-symbolics-registry';

/**
 * Translation options for symbolic grammar harmonization
 */
export interface HarmonizationOptions {
  preserveStructure?: boolean;        // Maintain structural elements during translation
  adaptToCapabilities?: boolean;      // Adapt operations to target vendor capabilities
  includeComments?: boolean;          // Include comments about the translation
  embedTraceability?: boolean;        // Embed source tracking in translation
  formatOutput?: boolean;             // Apply formatting to the output
  handleResidue?: boolean;            // Handle and report symbolic residue
  fallbackBehavior?: 'omit' | 'emulate' | 'comment'; // How to handle unsupported operations
}

/**
 * Result of a harmonization operation
 */
export interface HarmonizationResult {
  transformed: string;                // Transformed content
  originalVendor: ModelVendor;        // Source vendor
  targetVendor: ModelVendor;          // Target vendor
  operations: {                       // Operations that were transformed
    original: SymbolicPrimitive;
    target: SymbolicPrimitive | null;
    success: boolean;
    message?: string;
  }[];
  residue: {                          // Symbolic residue detected
    pattern: string;
    position: number;
    possiblePrimitive?: SymbolicPrimitive;
  }[];
  metrics: {                          // Metrics about the transformation
    totalOperations: number;
    successfulOperations: number;
    unsupportedOperations: number;
    adaptedOperations: number;
  };
}

/**
 * Symbolic Grammar Harmonizer
 * 
 * Provides bidirectional translation between all symbolic grammars
 * across different model vendors.
 */
export class SymbolicHarmonizer {
  private registry: SymbolicsRegistry;
  
  constructor(registry?: SymbolicsRegistry) {
    this.registry = registry || new SymbolicsRegistry();
  }
  
  /**
   * Harmonize content from source vendor to target vendor
   */
  public harmonize(
    content: string,
    sourceVendor: ModelVendor,
    targetVendor: ModelVendor,
    options: HarmonizationOptions = {}
  ): HarmonizationResult {
    // Default options
    const opts: Required<HarmonizationOptions> = {
      preserveStructure: options.preserveStructure !== undefined ? options.preserveStructure : true,
      adaptToCapabilities: options.adaptToCapabilities !== undefined ? options.adaptToCapabilities : true,
      includeComments: options.includeComments !== undefined ? options.includeComments : false,
      embedTraceability: options.embedTraceability !== undefined ? options.embedTraceability : false,
      formatOutput: options.formatOutput !== undefined ? options.formatOutput : true,
      handleResidue: options.handleResidue !== undefined ? options.handleResidue : true,
      fallbackBehavior: options.fallbackBehavior || 'emulate'
    };
    
    // Initialize result
    const result: HarmonizationResult = {
      transformed: '',
      originalVendor: sourceVendor,
      targetVendor: targetVendor,
      operations: [],
      residue: [],
      metrics: {
        totalOperations: 0,
        successfulOperations: 0,
        unsupportedOperations: 0,
        adaptedOperations: 0
      }
    };
    
    // Special case: same vendor, just return the content
    if (sourceVendor === targetVendor) {
      result.transformed = content;
      return result;
    }
    
    // Handle symbolic residue if enabled
    if (opts.handleResidue) {
      result.residue = this.registry.findSymbolicResidue(content, sourceVendor);
      
      // Only attempt repair if there is residue
      if (result.residue.length > 0) {
        content = this.registry.repairSymbolicResidue(content, sourceVendor);
      }
    }
    
    // Extract symbolic operations from source content
    const extractedOperations = this.registry.extractAllSymbolicOperations(content, sourceVendor);
    result.metrics.totalOperations = extractedOperations.length;
    
    // Build a map of operation positions to maintain structure
    const operationPositions = this.mapOperationPositions(content, sourceVendor);
    
    // Process each operation
    const operationResults: { primitive: SymbolicPrimitive, params: any, success: boolean, message?: string, transformed?: string }[] = [];
    
    for (const { primitive, params } of extractedOperations) {
      const operationResult = this.transformOperation(primitive, params, sourceVendor, targetVendor, opts);
      operationResults.push({
        primitive,
        params,
        success: operationResult.success,
        message: operationResult.message,
        transformed: operationResult.transformed
      });
      
      // Update metrics
      if (operationResult.success) {
        result.metrics.successfulOperations++;
        
        if (operationResult.adapted) {
          result.metrics.adaptedOperations++;
        }
      } else {
        result.metrics.unsupportedOperations++;
      }
      
      // Update operations log
      result.operations.push({
        original: primitive,
        target: operationResult.targetPrimitive,
        success: operationResult.success,
        message: operationResult.message
      });
    }
    
    // Generate transformed content
    result.transformed = this.generateTransformedContent(
      content,
      operationPositions,
      operationResults,
      sourceVendor,
      targetVendor,
      opts
    );
    
    // Apply formatting if enabled
    if (opts.formatOutput) {
      result.transformed = this.formatOutput(result.transformed, targetVendor);
    }
    
    return result;
  }
  
  /**
   * Transform a single symbolic operation from source to target vendor
   */
  private transformOperation(
    primitive: SymbolicPrimitive,
    params: any,
    sourceVendor: ModelVendor,
    targetVendor: ModelVendor,
    options: Required<HarmonizationOptions>
  ): {
    success: boolean;
    message?: string;
    transformed?: string;
    targetPrimitive: SymbolicPrimitive | null;
    adapted: boolean;
  } {
    // Check if target vendor supports this primitive
    const targetSupport = this.registry.vendorSupports(targetVendor, primitive);
    
    // If not supported and adaptation is enabled, try to find a similar primitive
    let targetPrimitive = primitive;
    let adapted = false;
    
    if (!targetSupport && options.adaptToCapabilities) {
      const alternativePrimitive = this.findAlternativePrimitive(primitive, targetVendor);
      
      if (alternativePrimitive) {
        targetPrimitive = alternativePrimitive;
        adapted = true;
      }
    }
    
    // Check support for the (possibly adapted) target primitive
    const finalSupport = this.registry.vendorSupports(targetVendor, targetPrimitive);
    
    if (!finalSupport) {
      // Handle based on fallback behavior
      switch (options.fallbackBehavior) {
        case 'omit':
          return {
            success: false,
            message: `Operation ${primitive} not supported by ${targetVendor} and omitted`,
            targetPrimitive: null,
            adapted: false
          };
        
        case 'comment':
          return {
            success: false,
            message: `Operation ${primitive} not supported by ${targetVendor}`,
            transformed: this.generateCommentForUnsupported(primitive, params, sourceVendor, targetVendor),
            targetPrimitive: null,
            adapted: false
          };
        
        case 'emulate':
          // Try to emulate even if not natively supported
          const emulatedTransformation = this.emulateOperation(primitive, params, sourceVendor, targetVendor);
          
          if (emulatedTransformation) {
            return {
              success: true,
              message: `Operation ${primitive} emulated for ${targetVendor}`,
              transformed: emulatedTransformation,
              targetPrimitive: targetPrimitive,
              adapted: true
            };
          }
          
          // Fall through to comment if emulation is not possible
          return {
            success: false,
            message: `Operation ${primitive} not supported by ${targetVendor} and cannot be emulated`,
            transformed: this.generateCommentForUnsupported(primitive, params, sourceVendor, targetVendor),
            targetPrimitive: null,
            adapted: false
          };
      }
    }
    
    // Transform the operation
    const implementation = this.registry.getVendorImplementation(targetPrimitive, targetVendor);
    if (!implementation) {
      return {
        success: false,
        message: `Could not find implementation for ${targetPrimitive} in ${targetVendor}`,
        targetPrimitive: null,
        adapted: false
      };
    }
    
    // If adaptation occurred, adapt the parameters
    let adaptedParams = params;
    if (adapted) {
      adaptedParams = this.adaptParameters(params, primitive, targetPrimitive);
    }
    
    // Generate the transformation
    const transformed = this.generateTransformation(targetPrimitive, adaptedParams, implementation);
    
    // Add comments or traceability if enabled
    let finalTransformed = transformed;
    
    if (options.includeComments) {
      finalTransformed = this.addComments(transformed, primitive, sourceVendor, targetPrimitive, targetVendor, adapted);
    }
    
    if (options.embedTraceability) {
      finalTransformed = this.embedTraceability(finalTransformed, primitive, sourceVendor, targetVendor);
    }
    
    return {
      success: true,
      message: adapted ? `Operation ${primitive} adapted to ${targetPrimitive} for ${targetVendor}` : undefined,
      transformed: finalTransformed,
      targetPrimitive: targetPrimitive,
      adapted: adapted
    };
  }
  
  /**
   * Map positions of operations in source content
   */
  private mapOperationPositions(content: string, vendor: ModelVendor): Map<SymbolicPrimitive, number[]> {
    const positions = new Map<SymbolicPrimitive, number[]>();
    
    // Initialize positions for all primitives
    for (const primitive of Object.values(SymbolicPrimitive)) {
      positions.set(primitive, []);
    }
    
    // Map positions based on vendor's grammar style
    switch (vendor) {
      case ModelVendor.ANTHROPIC:
        // Map XML tags
        for (const primitive of Object.values(SymbolicPrimitive)) {
          const implementation = this.registry.getVendorImplementation(primitive, vendor);
          if (!implementation || implementation.style !== GrammarStyle.XML_TAGS) continue;
          
          if (implementation.prefix && implementation.suffix) {
            const regex = new RegExp(`${escapeRegExp(implementation.prefix)}[\\s\\S]*?${escapeRegExp(implementation.suffix)}`, 'g');
            let match;
            const primitivePositions = positions.get(primitive) || [];
            
            while ((match = regex.exec(content)) !== null) {
              primitivePositions.push(match.index);
            }
            
            positions.set(primitive, primitivePositions);
          }
        }
        break;
      
      case ModelVendor.QWEN:
      case ModelVendor.OPENAI:
        // Map slash commands
        for (const primitive of Object.values(SymbolicPrimitive)) {
          const implementation = this.registry.getVendorImplementation(primitive, vendor);
          if (!implementation || implementation.style !== GrammarStyle.SLASH_COMMANDS) continue;
          
          if (implementation.prefix) {
            const regex = new RegExp(`${escapeRegExp(implementation.prefix)}\\s+[^\\n]*`, 'g');
            let match;
            const primitivePositions = positions.get(primitive) || [];
            
            while ((match = regex.exec(content)) !== null) {
              primitivePositions.push(match.index);
            }
            
            positions.set(primitive, primitivePositions);
          }
        }
        break;
      
      // Add more cases for other vendors
    }
    
    return positions;
  }
