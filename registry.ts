/**
 * universal-symbolics-registry.ts
 * 
 * Core registry for unified symbolic operations across all LLM vendors.
 * This registry enables transformation between different symbolic grammars.
 */

// Import core schema definitions
import {
  ModelVendor,
  SymbolicPrimitive,
  GrammarStyle,
  SymbolicOperation,
  VendorImplementation,
  SYMBOLIC_RUNTIME_SCHEMA
} from './universal-symbolics-runtime';

/**
 * Symbol Mapping Record Types
 */
export interface GlyphMapping {
  glyph: string;
  primitive: SymbolicPrimitive;
  description: string;
}

export interface TagMapping {
  tag: string;
  primitive: SymbolicPrimitive;
  vendor: ModelVendor;
  description: string;
}

export interface SlashMapping {
  slash: string;
  primitive: SymbolicPrimitive;
  vendor: ModelVendor;
  description: string;
}

export interface DotMapping {
  dot: string;
  primitive: SymbolicPrimitive;
  description: string;
}

export interface OperatorMapping {
  operator: string;
  primitive: SymbolicPrimitive;
  description: string;
}

/**
 * Universal Symbolics Registry
 * 
 * Maintains mappings between different symbolic representations
 * and provides transformation functions for converting between them.
 */
export class SymbolicsRegistry {
  // Mapping collections
  private glyphMappings: Map<string, GlyphMapping>;
  private tagMappings: Map<string, TagMapping>;
  private slashMappings: Map<string, SlashMapping>;
  private dotMappings: Map<string, DotMapping>;
  private operatorMappings: Map<string, OperatorMapping>;
  
  // Vendor capabilities
  private vendorCapabilities: Map<ModelVendor, Set<SymbolicPrimitive>>;
  
  // Custom extensions
  private customSymbols: Map<string, SymbolicOperation>;
  
  constructor() {
    // Initialize maps
    this.glyphMappings = new Map();
    this.tagMappings = new Map();
    this.slashMappings = new Map();
    this.dotMappings = new Map();
    this.operatorMappings = new Map();
    this.vendorCapabilities = new Map();
    this.customSymbols = new Map();
    
    // Initialize registry with built-in mappings
    this.initializeRegistry();
  }
  
  /**
   * Initialize the registry with all built-in mappings
   */
  private initializeRegistry(): void {
    // Initialize vendor capabilities
    for (const vendor of Object.values(ModelVendor)) {
      this.vendorCapabilities.set(vendor, new Set());
    }
    
    // Process schema to populate maps
    for (const operation of SYMBOLIC_RUNTIME_SCHEMA) {
      // Register glyph mappings
      if (operation.glyphs) {
        for (const glyph of operation.glyphs) {
          this.registerGlyph(glyph, operation.type, `Glyph for ${operation.name}`);
        }
      }
      
      // Register tag mappings
      if (operation.tags) {
        for (const tag of operation.tags) {
          for (const impl of operation.vendorImplementations) {
            if (impl.style === GrammarStyle.XML_TAGS) {
              this.registerTag(tag, operation.type, impl.vendor, `XML tag for ${operation.name}`);
            }
          }
        }
      }
      
      // Register slash mappings
      if (operation.slashes) {
        for (const slash of operation.slashes) {
          for (const impl of operation.vendorImplementations) {
            if (impl.style === GrammarStyle.SLASH_COMMANDS) {
              this.registerSlash(slash, operation.type, impl.vendor, `Slash command for ${operation.name}`);
            }
          }
        }
      }
      
      // Register dot mappings
      const dotCommand = operation.universalSyntax.split('{')[0];
      this.registerDot(dotCommand, operation.type, `Universal syntax for ${operation.name}`);
      
      // Register vendor capabilities
      for (const impl of operation.vendorImplementations) {
        const capabilities = this.vendorCapabilities.get(impl.vendor);
        if (capabilities) {
          capabilities.add(operation.type);
        }
      }
    }
  }
  
  /**
   * Register a glyph mapping
   */
  public registerGlyph(glyph: string, primitive: SymbolicPrimitive, description: string): void {
    this.glyphMappings.set(glyph, { glyph, primitive, description });
  }
  
  /**
   * Register a tag mapping
   */
  public registerTag(tag: string, primitive: SymbolicPrimitive, vendor: ModelVendor, description: string): void {
    this.tagMappings.set(`${vendor}:${tag}`, { tag, primitive, vendor, description });
  }
  
  /**
   * Register a slash mapping
   */
  public registerSlash(slash: string, primitive: SymbolicPrimitive, vendor: ModelVendor, description: string): void {
    this.slashMappings.set(`${vendor}:${slash}`, { slash, primitive, vendor, description });
  }
  
  /**
   * Register a dot mapping
   */
  public registerDot(dot: string, primitive: SymbolicPrimitive, description: string): void {
    this.dotMappings.set(dot, { dot, primitive, description });
  }
  
  /**
   * Register an operator mapping
   */
  public registerOperator(operator: string, primitive: SymbolicPrimitive, description: string): void {
    this.operatorMappings.set(operator, { operator, primitive, description });
  }
  
  /**
   * Register a custom symbolic operation
   */
  public registerCustomSymbol(operation: SymbolicOperation): void {
    this.customSymbols.set(operation.name, operation);
  }
  
  /**
   * Get all glyph mappings
   */
  public getAllGlyphMappings(): GlyphMapping[] {
    return Array.from(this.glyphMappings.values());
  }
  
  /**
   * Get all tag mappings
   */
  public getAllTagMappings(): TagMapping[] {
    return Array.from(this.tagMappings.values());
  }
  
  /**
   * Get all slash mappings
   */
  public getAllSlashMappings(): SlashMapping[] {
    return Array.from(this.slashMappings.values());
  }
  
  /**
   * Get all dot mappings
   */
  public getAllDotMappings(): DotMapping[] {
    return Array.from(this.dotMappings.values());
  }
  
  /**
   * Get all operator mappings
   */
  public getAllOperatorMappings(): OperatorMapping[] {
    return Array.from(this.operatorMappings.values());
  }
  
  /**
   * Get symbolic primitive by glyph
   */
  public getPrimitiveByGlyph(glyph: string): SymbolicPrimitive | undefined {
    const mapping = this.glyphMappings.get(glyph);
    return mapping?.primitive;
  }
  
  /**
   * Get symbolic primitive by tag
   */
  public getPrimitiveByTag(tag: string, vendor: ModelVendor): SymbolicPrimitive | undefined {
    const mapping = this.tagMappings.get(`${vendor}:${tag}`);
    return mapping?.primitive;
  }
  
  /**
   * Get symbolic primitive by slash command
   */
  public getPrimitiveBySlash(slash: string, vendor: ModelVendor): SymbolicPrimitive | undefined {
    const mapping = this.slashMappings.get(`${vendor}:${slash}`);
    return mapping?.primitive;
  }
  
  /**
   * Get symbolic primitive by dot command
   */
  public getPrimitiveByDot(dot: string): SymbolicPrimitive | undefined {
    const mapping = this.dotMappings.get(dot);
    return mapping?.primitive;
  }
  
  /**
   * Get symbolic primitive by operator
   */
  public getPrimitiveByOperator(operator: string): SymbolicPrimitive | undefined {
    const mapping = this.operatorMappings.get(operator);
    return mapping?.primitive;
  }
  
  /**
   * Get symbolic operation by primitive
   */
  public getOperationByPrimitive(primitive: SymbolicPrimitive): SymbolicOperation | undefined {
    // Check built-in operations
    const builtIn = SYMBOLIC_RUNTIME_SCHEMA.find(op => op.type === primitive);
    if (builtIn) return builtIn;
    
    // Check custom operations
    for (const operation of this.customSymbols.values()) {
      if (operation.type === primitive) return operation;
    }
    
    return undefined;
  }
  
  /**
   * Get vendor implementation for a primitive
   */
  public getVendorImplementation(primitive: SymbolicPrimitive, vendor: ModelVendor): VendorImplementation | undefined {
    const operation = this.getOperationByPrimitive(primitive);
    if (!operation) return undefined;
    
    return operation.vendorImplementations.find(impl => impl.vendor === vendor);
  }
  
  /**
   * Check if a vendor supports a primitive
   */
  public vendorSupports(vendor: ModelVendor, primitive: SymbolicPrimitive): boolean {
    const capabilities = this.vendorCapabilities.get(vendor);
    if (!capabilities) return false;
    
    return capabilities.has(primitive);
  }
  
  /**
   * Get all primitives supported by a vendor
   */
  public getVendorSupportedPrimitives(vendor: ModelVendor): SymbolicPrimitive[] {
    const capabilities = this.vendorCapabilities.get(vendor);
    if (!capabilities) return [];
    
    return Array.from(capabilities);
  }
  
  /**
   * Get support level for a primitive across all vendors
   */
  public getPrimitiveSupportMap(primitive: SymbolicPrimitive): Record<ModelVendor, boolean> {
    const result: Record<ModelVendor, boolean> = {} as Record<ModelVendor, boolean>;
    
    for (const vendor of Object.values(ModelVendor)) {
      result[vendor] = this.vendorSupports(vendor, primitive);
    }
    
    return result;
  }
  
  /**
   * Transform universal syntax to vendor-specific syntax
   */
  public transformToVendor(universalSyntax: string, vendor: ModelVendor): string {
    // Parse universal syntax
    const match = universalSyntax.match(/^(.+?)\{(.+)\}$/);
    if (!match) return universalSyntax; // Not a valid universal syntax
    
    const [_, command, paramsString] = match;
    
    // Parse parameters
    let params: Record<string, any> = {};
    try {
      // Simple parsing for demonstration - in production, would need a more robust parser
      paramsString.split(',').forEach(pair => {
        const [key, value] = pair.split(':').map(s => s.trim());
        params[key] = value;
      });
    } catch (error) {
      return universalSyntax; // Invalid parameters
    }
    
    // Get primitive from command
    const primitive = this.getPrimitiveByDot(command);
    if (!primitive) return universalSyntax; // Unknown command
    
    // Get vendor implementation
    const implementation = this.getVendorImplementation(primitive, vendor);
    if (!implementation) return universalSyntax; // Vendor doesn't support this primitive
    
    // Transform to vendor syntax
    switch (implementation.style) {
      case GrammarStyle.XML_TAGS:
        if (implementation.prefix && implementation.suffix) {
          return `${implementation.prefix}${params.content || ''}${implementation.suffix}`;
        }
        break;
      case GrammarStyle.SLASH_COMMANDS:
        if (implementation.prefix) {
          return `${implementation.prefix} ${params.content || ''}`;
        }
        break;
      case GrammarStyle.API_PARAMETERS:
        // Would be handled at API level, not string transformation
        return `API parameter: ${JSON.stringify(params)}`;
      case GrammarStyle.SYSTEM_PROMPTS:
        // Transform to system prompt format
        const operation = this.getOperationByPrimitive(primitive);
        return `System instruction for ${operation?.name || primitive}: ${params.content || ''}`;
      // Add more cases for other grammar styles
    }
    
    return universalSyntax; // Default fallback
  }
  
  /**
   * Transform vendor-specific syntax to universal syntax
   */
  public transformToUniversal(vendorSyntax: string, vendor: ModelVendor): string {
    // XML tags
    if (vendor === ModelVendor.ANTHROPIC || 
        vendor === ModelVendor.UNIVERSAL) {
      const tagMatches = vendorSyntax.match(/<(\w+)>([\s\S]*?)<\/\1>/);
      if (tagMatches) {
        const [_, tag, content] = tagMatches;
        const primitive = this.getPrimitiveByTag(tag, vendor);
        if (primitive) {
          const operation = this.getOperationByPrimitive(primitive);
          if (operation) {
            return `${operation.universalSyntax.split('{')[0]}{content: "${content}"}`;
          }
        }
      }
    }
    
    // Slash commands
    if (vendor === ModelVendor.OPENAI || 
        vendor === ModelVendor.QWEN || 
        vendor === ModelVendor.UNIVERSAL) {
      const slashMatches = vendorSyntax.match(/^\/(\w+)\s+([\s\S]*)$/);
      if (slashMatches) {
        const [_, slash, content] = slashMatches;
        const primitive = this.getPrimitiveBySlash(slash, vendor);
        if (primitive) {
          const operation = this.getOperationByPrimitive(primitive);
          if (operation) {
            return `${operation.universalSyntax.split('{')[0]}{content: "${content}"}`;
          }
        }
      }
    }
    
    // Add more parsing for other grammar styles
    
    return vendorSyntax; // Default fallback
  }
  
  /**
   * Parse symbolic operations from text
   */
  public parseSymbolicOperations(text: string, vendor: ModelVendor): Array<{ primitive: SymbolicPrimitive, params: any }> {
    const operations: Array<{ primitive: SymbolicPrimitive, params: any }> = [];
    
    // Parse based on vendor's grammar style
    switch (vendor) {
      case ModelVendor.ANTHROPIC:
        // Parse XML tags
        const tagRegex = /<(\w+)>([\s\S]*?)<\/\1>/g;
        let tagMatch;
        while ((tagMatch = tagRegex.exec(text)) !== null) {
          const tag = tagMatch[1];
          const content = tagMatch[2];
          const primitive = this.getPrimitiveByTag(tag, vendor);
          if (primitive) {
            operations.push({
              primitive,
              params: { content }
            });
          }
        }
        break;
      
      case ModelVendor.QWEN:
      case ModelVendor.OPENAI:
        // Parse slash commands
        const slashRegex = /\/(\w+)\s+([\s\S]*?)(?=\/\w+\s+|$)/g;
        let slashMatch;
        while ((slashMatch = slashRegex.exec(text)) !== null) {
          const slash = slashMatch[1];
          const content = slashMatch[2].trim();
          const primitive = this.getPrimitiveBySlash(slash, vendor);
          if (primitive) {
            operations.push({
              primitive,
              params: { content }
            });
          }
        }
        break;
      
      // Add cases for other vendors
    }
    
    return operations;
  }
  
  /**
   * Generate symbolic content in vendor-specific format
   */
  public generateSymbolicContent(operations: Array<{ primitive: SymbolicPrimitive, params: any }>, vendor: ModelVendor): string {
    let content = '';
    
    for (const { primitive, params } of operations) {
      const implementation = this.getV
