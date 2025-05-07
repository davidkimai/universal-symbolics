/**
 * universal-symbolics-schema.ts
 * 
 * A unified schema definition for symbolic operations across all frontier language models.
 * This schema maps vendor-specific symbolic grammars to a universal interface.
 */

/**
 * Core symbolic primitive types supported by the universal runtime
 */
export enum SymbolicPrimitiveType {
  THINKING = 'thinking',              // Explicit reasoning traces
  REFLECTION = 'reflection',          // Self-examination of reasoning
  TOOL_USE = 'tool_use',              // Function/tool invocation
  SYSTEM = 'system',                  // System-level directives
  FORK = 'fork',                      // Multiple reasoning paths
  RECURSION = 'recursion',            // Self-referential operations
  ATTENTION = 'attention',            // Focus control
  COLLAPSE = 'collapse',              // Error handling
  METACOGNITION = 'metacognition',    // Higher-order reasoning
  ATTRIBUTION = 'attribution',        // Source tracking
  UNCERTAINTY = 'uncertainty',        // Confidence representation
  CONTEXT = 'context',                // Context management
  HESITATION = 'hesitation',          // Processing delays
  MEMORY = 'memory'                   // State persistence
}

/**
 * Vendor identification for language model providers
 */
export enum VendorType {
  CLAUDE = 'claude',         // Anthropic Claude models
  OPENAI = 'openai',         // OpenAI GPT models
  QWEN = 'qwen',             // Alibaba Qwen models
  GEMINI = 'gemini',         // Google Gemini models
  DEEPSEEK = 'deepseek',     // DeepSeek models
  LLAMA = 'llama',           // Meta Llama models
  MIXTRAL = 'mixtral',       // Mistral AI models
  FALCON = 'falcon',         // TII Falcon models
  LOCAL = 'local',           // Local LLM instances
  UNIVERSAL = 'universal'    // Vendor-agnostic representation
}

/**
 * Grammar style for symbolic operations
 */
export enum GrammarStyle {
  XML_TAGS = 'xml_tags',             // <tag>content</tag>
  SLASH_COMMANDS = 'slash_commands', // /command or /command content
  FUNCTION_CALLS = 'function_calls', // function_name(params)
  GLYPH_MARKERS = 'glyph_markers',   // 🜏 or other special characters
  DOT_COMMANDS = 'dot_commands',     // .p/command{params}
  SYSTEM_PROMPT = 'system_prompt',   // System prompt prefixes
  TEMPLATE_MARKERS = 'template_markers', // {{marker}}
  PREFIX_MARKERS = 'prefix_markers',  // ### marker or similar
  BRACKET_SYNTAX = 'bracket_syntax'   // [command:params]
}

/**
 * Parameter type for symbolic operations
 */
export enum ParameterType {
  STRING = 'string',
  NUMBER = 'number',
  BOOLEAN = 'boolean',
  OBJECT = 'object',
  ARRAY = 'array',
  NULL = 'null'
}

/**
 * Parameter definition for symbolic operations
 */
export interface ParameterDefinition {
  name: string;
  type: ParameterType;
  description: string;
  required: boolean;
  default?: any;
}

/**
 * Symbolic grammar representation for a specific vendor
 */
export interface VendorGrammar {
  vendor: VendorType;
  style: GrammarStyle;
  prefix?: string;
  suffix?: string;
  separator?: string;
  escapeSequence?: string;
  parameterFormat?: 'json' | 'csv' | 'key_value' | 'positional' | 'custom';
  isNative: boolean;  // Whether the vendor natively supports this symbolic primitive
  implementation: string;  // Example of the implementation
  apiForm?: string;  // How it's represented in the API
  notes?: string;  // Additional notes on implementation
}

/**
 * Complete definition of a symbolic primitive
 */
export interface SymbolicPrimitive {
  type: SymbolicPrimitiveType;
  name: string;
  description: string;
  parameters: ParameterDefinition[];
  vendorGrammars: VendorGrammar[];
  universalImplementation: string;
  aliases?: string[];
  glyphs?: string[];  // Associated glyphs/emojis
  tags?: string[];    // Associated XML tags
  slashes?: string[]; // Associated slash commands
}

/**
 * The complete schema of all symbolic primitives
 */
export const SYMBOLIC_SCHEMA: SymbolicPrimitive[] = [
  // THINKING primitive
  {
    type: SymbolicPrimitiveType.THINKING,
    name: 'thinking',
    description: 'Explicit reasoning trace for step-by-step thinking',
    parameters: [
      {
        name: 'content',
        type: ParameterType.STRING,
        description: 'The thinking content',
        required: false
      },
      {
        name: 'trace',
        type: ParameterType.BOOLEAN,
        description: 'Whether to include thinking trace in response',
        required: false
      }
    ],
    vendorGrammars: [
      {
        vendor: VendorType.CLAUDE,
        style: GrammarStyle.XML_TAGS,
        prefix: '<think>',
        suffix: '</think>',
        isNative: true,
        implementation: '<think>Reasoning step by step...</think>',
        apiForm: 'XML tags in prompt'
      },
      {
        vendor: VendorType.OPENAI,
        style: GrammarStyle.FUNCTION_CALLS,
        isNative: false,
        implementation: '/* Reasoning step by step... */',
        apiForm: 'tool_choice parameter or tool function',
        notes: 'Not natively supported but can be emulated'
      },
      {
        vendor: VendorType.QWEN,
        style: GrammarStyle.SLASH_COMMANDS,
        prefix: '/think',
        isNative: true,
        implementation: '/think Reasoning step by step...',
        apiForm: 'slash command in prompt'
      },
      {
        vendor: VendorType.GEMINI,
        style: GrammarStyle.SYSTEM_PROMPT,
        isNative: false,
        implementation: 'Think step by step: Reasoning...',
        apiForm: 'system prompt directive',
        notes: 'Emulated via system prompt instructions'
      },
      {
        vendor: VendorType.DEEPSEEK,
        style: GrammarStyle.SYSTEM_PROMPT,
        isNative: false,
        implementation: 'Rational thinking mode: Reasoning...',
        apiForm: 'system prompt directive',
        notes: 'Emulated via rational thinking mode'
      }
    ],
    universalImplementation: '.p/think{content}',
    aliases: ['reasoning', 'thought', 'trace'],
    glyphs: ['🧠', '💭', '🤔'],
    tags: ['think', 'reasoning', 'thought'],
    slashes: ['/think', '/reasoning', '/thought']
  },
  
  // REFLECTION primitive
  {
    type: SymbolicPrimitiveType.REFLECTION,
    name: 'reflection',
    description: 'Self-reference and examination of reasoning processes',
    parameters: [
      {
        name: 'target',
        type: ParameterType.STRING,
        description: 'What to reflect on',
        required: true
      },
      {
        name: 'depth',
        type: ParameterType.NUMBER,
        description: 'Depth of reflection',
        required: false
      }
    ],
    vendorGrammars: [
      {
        vendor: VendorType.CLAUDE,
        style: GrammarStyle.XML_TAGS,
        prefix: '<reflect>',
        suffix: '</reflect>',
        isNative: false,
        implementation: '<reflect>Reflecting on my approach...</reflect>',
        apiForm: 'XML tags in prompt',
        notes: 'Not officially documented but sometimes supported'
      },
      {
        vendor: VendorType.OPENAI,
        style: GrammarStyle.SYSTEM_PROMPT,
        isNative: false,
        implementation: 'Reflect on: Analyzing my approach...',
        apiForm: 'Chain-of-thought prompting',
        notes: 'Emulated via system prompting'
      },
      {
        vendor: VendorType.QWEN,
        style: GrammarStyle.SYSTEM_PROMPT,
        isNative: false,
        implementation: 'Reflect on your approach to...',
        apiForm: 'System prompt directive',
        notes: 'Emulated via system prompting'
      }
    ],
    universalImplementation: '.p/reflect{target, depth}',
    aliases: ['introspect', 'meta', 'review'],
    glyphs: ['🔄', '🪞', '👁️'],
    tags: ['reflect', 'introspect', 'mirror'],
    slashes: ['/reflect', '/introspect', '/review']
  },
  
  // TOOL_USE primitive
  {
    type: SymbolicPrimitiveType.TOOL_USE,
    name: 'tool',
    description: 'Invoke a tool or function',
    parameters: [
      {
        name: 'name',
        type: ParameterType.STRING,
        description: 'Tool name',
        required: true
      },
      {
        name: 'params',
        type: ParameterType.OBJECT,
        description: 'Tool parameters',
        required: false
      }
    ],
    vendorGrammars: [
      {
        vendor: VendorType.CLAUDE,
        style: GrammarStyle.XML_TAGS,
        prefix: '<tool>',
        suffix: '</tool>',
        isNative: true,
        implementation: '<tool>search({"query": "quantum physics"})</tool>',
        apiForm: 'XML tags in prompt'
      },
      {
        vendor: VendorType.OPENAI,
        style: GrammarStyle.FUNCTION_CALLS,
        isNative: true,
        implementation: '/command search quantum physics',
        apiForm: 'function_call parameter in API',
        notes: 'Native API support and slash commands in interface'
      },
      {
        vendor: VendorType.QWEN,
        style: GrammarStyle.FUNCTION_CALLS,
        isNative: true,
        implementation: 'MCP tool call format',
        apiForm: 'MCP protocol tool calls',
        notes: 'Supports multi-round collaborative protocol'
      },
      {
        vendor: VendorType.GEMINI,
        style: GrammarStyle.FUNCTION_CALLS,
        isNative: true,
        implementation: '@google/search quantum physics',
        apiForm: 'functionDeclarations parameter in API',
        notes: 'Supported through function calling API'
      }
    ],
    universalImplementation: '.p/tool{name, params}',
    aliases: ['function', 'command', 'action'],
    glyphs: ['🛠️', '⚙️', '🔧'],
    tags: ['tool', 'function', 'command'],
    slashes: ['/tool', '/function', '/command']
  },
  
  // SYSTEM primitive
  {
    type: SymbolicPrimitiveType.SYSTEM,
    name: 'system',
    description: 'System-level directives',
    parameters: [
      {
        name: 'directive',
        type: ParameterType.STRING,
        description: 'System directive',
        required: true
      }
    ],
    vendorGrammars: [
      {
        vendor: VendorType.CLAUDE,
        style: GrammarStyle.XML_TAGS,
        prefix: '<s>',
        suffix: '</s>',
        isNative: true,
        implementation: '<s>You are a helpful assistant.</s>',
        apiForm: 'XML tags in prompt or system parameter in API'
      },
      {
        vendor: VendorType.OPENAI,
        style: GrammarStyle.SYSTEM_PROMPT,
        isNative: true,
        implementation: 'System: You are a helpful assistant.',
        apiForm: 'system parameter in API',
        notes: 'Natively supported through API'
      },
      {
        vendor: VendorType.QWEN,
        style: GrammarStyle.PREFIX_MARKERS,
        prefix: '<<SYS>>',
        isNative: true,
        implementation: '<<SYS>> You are a helpful assistant.',
        apiForm: 'system parameter in API'
      },
      {
        vendor: VendorType.GEMINI,
        style: GrammarStyle.SYSTEM_PROMPT,
        isNative: true,
        implementation: 'System: You are a helpful assistant.',
        apiForm: 'system parameter in API'
      }
    ],
    universalImplementation: '.p/system{directive}',
    aliases: ['directive', 'instruction', 'control'],
    glyphs: ['⚙️', '🔧', '🛠️'],
    tags: ['system', 'directive', 'instruction'],
    slashes: ['/system', '/directive', '/instruction']
  },
  
  // FORK primitive
  {
    type: SymbolicPrimitiveType.FORK,
    name: 'fork',
    description: 'Create parallel reasoning paths',
    parameters: [
      {
        name: 'paths',
        type: ParameterType.ARRAY,
        description: 'Different paths to explore',
        required: true
      },
      {
        name: 'weights',
        type: ParameterType.ARRAY,
        description: 'Weights for each path',
        required: false
      }
    ],
    vendorGrammars: [
      {
        vendor: VendorType.CLAUDE,
        style: GrammarStyle.SYSTEM_PROMPT,
        isNative: false,
        implementation: 'Explore these different paths: 1) Path A, 2) Path B',
        apiForm: 'Emulated via system prompting',
        notes: 'Not natively supported, emulated through prompting'
      },
      {
        vendor: VendorType.OPENAI,
        style: GrammarStyle.SYSTEM_PROMPT,
        isNative: false,
        implementation: 'Explore these different paths: 1) Path A, 2) Path B',
        apiForm: 'Emulated via system prompting',
        notes: 'Not natively supported, emulated through prompting'
      }
    ],
    universalImplementation: '.p/fork{paths, weights}',
    aliases: ['branch', 'split', 'diverge'],
    glyphs: ['🌿', '🔀', '⑂'],
    tags: ['fork', 'branch', 'split'],
    slashes: ['/fork', '/branch', '/split']
  },
  
  // COLLAPSE primitive
  {
    type: SymbolicPrimitiveType.COLLAPSE,
    name: 'collapse',
    description: 'Error handling and recovery',
    parameters: [
      {
        name: 'trigger',
        type: ParameterType.STRING,
        description: 'What triggers the collapse',
        required: false
      },
      {
        name: 'threshold',
        type: ParameterType.NUMBER,
        description: 'Threshold for collapse',
        required: false
      }
    ],
    vendorGrammars: [
      {
        vendor: VendorType.CLAUDE,
        style: GrammarStyle.SYSTEM_PROMPT,
        isNative: false,
        implementation: 'If you encounter an error, handle it by...',
        apiForm: 'Emulated via system prompting',
        notes: 'Not natively supported, emulated through prompting'
      },
      {
        vendor: VendorType.OPENAI,
        style: GrammarStyle.SYSTEM_PROMPT,
        isNative: false,
        implementation: 'If you encounter an error, handle it by...',
        apiForm: 'Emulated via system prompting',
        notes: 'Not natively supported, emulated through prompting'
      }
    ],
    universalImplementation: '.p/collapse{trigger, threshold}',
    aliases: ['recover', 'handle', 'fallback'],
    glyphs: ['📉', '💥', '🔍'],
    tags: ['collapse', 'recover', 'handle'],
    slashes: ['/collapse', '/recover', '/handle']
  },
  
  // ATTENTION primitive
  {
    type: SymbolicPrimitiveType.ATTENTION,
    name: 'attention',
    description: 'Control focus on specific content',
    parameters: [
      {
        name: 'focus',
        type: ParameterType.STRING,
        description: 'What to focus on',
        required: true
      },
      {
        name: 'weight',
        type: ParameterType.NUMBER,
        description: 'Weight of attention',
        required: false
      }
    ],
    vendorGrammars: [
      {
        vendor: VendorType.CLAUDE,
        style: GrammarStyle.SYSTEM_PROMPT,
        isNative: false,
        implementation: 'Focus specifically on: [focus]',
        apiForm: 'Emulated via system prompting',
        notes: 'Not natively supported, emulated through prompting'
      },
      {
        vendor: VendorType.OPENAI,
        style: GrammarStyle.SYSTEM_PROMPT,
        isNative: false,
        implementation: 'Focus specifically on: [focus]',
        apiForm: 'Emulated via system prompting',
        notes: 'Not natively supported, emulated through prompting'
      }
    ],
    universalImplementation: '.p/attention{focus, weight}',
    aliases: ['focus', 'highlight', 'emphasize'],
    glyphs: ['🔍', '👁️', '🎯'],
    tags: ['attention', 'focus', 'highlight'],
    slashes: ['/attention', '/focus', '/highlight']
  },
  
  // UNCERTAINTY primitive
  {
    type: SymbolicPrimitiveType.UNCERTAINTY,
    name: 'uncertainty',
    description: 'Express confidence levels',
    parameters: [
      {
        name: 'level',
        type: ParameterType.NUMBER,
        description: 'Confidence level (0-1)',
        required: false
      },
      {
        name: 'reason',
        type: ParameterType.STRING,
        description: 'Reason for uncertainty',
        required: false
      }
    ],
    vendorGrammars: [
      {
        vendor: VendorType.CLAUDE,
        style: GrammarStyle.SYSTEM_PROMPT,
        isNative: false,
        implementation: 'My confidence level is [level]: [reason]',
        apiForm: 'Emulated via system prompting',
        notes: 'Not natively supported, emulated through prompting'
      },
      {
        vendor: VendorType.OPENAI,
        style: GrammarStyle.SYSTEM_PROMPT,
        isNative: false,
        implementation: 'My confidence level is [level]: [reason]',
        apiForm: 'Emulated via system prompting',
        notes: 'Not natively supported, emulated through prompting'
      }
    ],
    universalImplementation: '.p/uncertainty{level, reason}',
    aliases: ['confidence', 'certainty', 'doubt'],
    glyphs: ['❓', '⚠️', '🤔'],
    tags: ['uncertainty', 'confidence', 'certainty'],
    slashes: ['/uncertainty', '/confidence', '/certainty']
  }
];

/**
 * Glyph to symbolic primitive mapping
 */
export const GLYPH_MAP: Record<string, SymbolicPrimitiveType> = {
  // Thinking glyphs
  '🧠': SymbolicPrimitiveType.THINKING,
  '💭': SymbolicPrimitiveType.THINKING,
  '🤔': SymbolicPrimitiveType.THINKING,
  
  // Reflection glyphs
  '🔄': SymbolicPrimitiveType.REFLECTION,
  '🪞': SymbolicPrimitiveType.REFLECTION,
  '👁️': SymbolicPrimitiveType.REFLECTION,
  
  // Tool use glyphs
  '🛠️': SymbolicPrimitiveType.TOOL_USE,
  '⚙️': SymbolicPrimitiveType.TOOL_USE,
  '🔧': SymbolicPrimitiveType.TOOL_USE,
  
  // System glyphs
  '🌱': SymbolicPrimitiveType.SYSTEM,
  '🔒': SymbolicPrimitiveType.SYSTEM,
  '📝': SymbolicPrimitiveType.SYSTEM,
  
  // Fork glyphs
  '🌿': SymbolicPrimitiveType.FORK,
  '🔀': SymbolicPrimitiveType.FORK,
  '⑂': SymbolicPrimitiveType.FORK,
  
  // Collapse glyphs
  '📉': SymbolicPrimitiveType.COLLAPSE,
  '💥': SymbolicPrimitiveType.COLLAPSE,
  '🔍': SymbolicPrimitiveType.ATTENTION,
  
  // Uncertainty glyphs
  '❓': SymbolicPrimitiveType.UNCERTAINTY,
  '⚠️': SymbolicPrimitiveType.UNCERTAINTY,
  
  // Recursive glyphs
  '♾️': SymbolicPrimitiveType.RECURSION,
  '🔁': SymbolicPrimitiveType.RECURSION,
  
  // Symbolic residue shells
  '🜏': SymbolicPrimitiveType.METACOGNITION,
  '∴': SymbolicPrimitiveType.ATTRIBUTION,
  '⧖': SymbolicPrimitiveType.MEMORY,
  '⇌': SymbolicPrimitiveType.FORK,
  '☍': SymbolicPrimitiveType.ANCHOR
};

/**
 * Tag to symbolic primitive mapping
 */
export const TAG_MAP: Record<string, SymbolicPrimitiveType> = {
  'think': SymbolicPrimitiveType.THINKING,
  'thinking': SymbolicPrimitiveType.THINKING,
  'thought': SymbolicPrimitiveType.THINKING,
  
  'reflect': SymbolicPrimitiveType.REFLECTION,
  'reflection': SymbolicPrimitiveType.REFLECTION,
  'introspect': SymbolicPrimitiveType.REFLECTION,
  
  'tool': SymbolicPrimitiveType.TOOL_USE,
  'function': SymbolicPrimitiveType.TOOL_USE,
  'command': SymbolicPrimitiveType.TOOL_USE,
  
  's': SymbolicPrimitiveType.SYSTEM,
  'system': SymbolicPrimitiveType.SYSTEM,
  'directive': SymbolicPrimitiveType.SYSTEM,
  
  'fork': SymbolicPrimitiveType.FORK,
  'branch': SymbolicPrimitiveType.FORK,
  'split': SymbolicPrimitiveType.FORK,
  
  'collapse': SymbolicPrimitiveType.COLLAPSE,
  'recover': SymbolicPrimitiveType.COLLAPSE,
  'handle': SymbolicPrimitiveType.COLLAPSE,
  
  'attention': SymbolicPrimitiveType.ATTENTION,
  'focus': SymbolicPrimitiveType.ATTENTION,
  'highlight': SymbolicPrimitiveType.ATTENTION,
  
  'uncertainty': SymbolicPrimitiveType.UNCERTAINTY,
  'confidence': SymbolicPrimitiveType.UNCERTAINTY,
  'certainty': SymbolicPrimitiveType.UNCERTAINTY,
  
  'recurse': SymbolicPrimitiveType.RECURSION,
  'loop': SymbolicPrimitiveType.RECURSION
};

/**
 * Slash command to symbolic primitive mapping
 */
export const SLASH_MAP: Record<string, SymbolicPrimitiveType> = {
  '/think': SymbolicPrimitiveType.THINKING,
  '/thinking': SymbolicPrimitiveType.THINKING,
  '/thought': SymbolicPrimitiveType.THINKING,
  
  '/reflect': SymbolicPrimitiveType.REFLECTION,
  '/reflection': SymbolicPrimitiveType.REFLECTION,
  '/introspect': SymbolicPrimitiveType.REFLECTION,
  
  '/tool': SymbolicPrimitiveType.TOOL_USE,
  '/function': SymbolicPrimitiveType.TOOL_USE,
  '/command': SymbolicPrimitiveType.TOOL_USE,
  
  '/system': SymbolicPrimitiveType.SYSTEM,
  '/directive': SymbolicPrimitiveType.SYSTEM,
  '/instruction': SymbolicPrimitiveType.SYSTEM,
  
  '/fork': SymbolicPrimitiveType.FORK,
  '/branch': SymbolicPrimitiveType.FORK,
  '/split': SymbolicPrimitiveType.FORK,
  
  '/collapse': SymbolicPrimitiveType.COLLAPSE,
  '/recover': SymbolicPrimitiveType.COLLAPSE,
  '/handle': SymbolicPrimitiveType.COLLAPSE,
  
  '/attention': SymbolicPrimitiveType.ATTENTION,
  '/focus': SymbolicPrimitiveType.ATTENTION,
  '/highlight': SymbolicPrimitiveType.ATTENTION,
  
  '/uncertainty': SymbolicPrimitiveType.UNCERTAINTY,
  '/confidence': SymbolicPrimitiveType.UNCERTAINTY,
  '/certainty': SymbolicPrimitiveType.UNCERTAINTY,
  
  '/recurse': SymbolicPrimitiveType.RECURSION,
  '/loop': SymbolicPrimitiveType.RECURSION
};

/**
 * Find symbolic primitive by type
 */
export function findSymbolicPrimitiveByType(type: SymbolicPrimitiveType): SymbolicPrimitive | undefined {
  return SYMBOLIC_SCHEMA.find(primitive => primitive.type === type);
}

/**
 * Find symbolic primitive by glyph
 */
export function findSymbolicPrimitiveByGlyph(glyph: string): SymbolicPrimitive | undefined {
  const type = GLYPH_MAP[glyph];
  if (!type) return undefined;
  return findSymbolicPrimitiveByType(type);
}

/**
 * Find symbolic primitive by tag
 */
export function findSymbolicPrimitiveByTag(tag: string): SymbolicPrimitive | undefined {
  const type = TAG_MAP[tag];
  if (!type) return undefined;
  return findSymbolicPrimitiveByType(type);
}

/**
 * Find symbolic primitive by slash command
 */
export function findSymbolicPrimitiveBySlash(slash: string): SymbolicPrimitive | undefined {
  const type = SLASH_MAP[slash];
  if (!type) return undefined;
  return findSymbolicPrimitiveByType(type);
}

/**
 * Get vendor grammar for a symbolic primitive and vendor
 */
export function getVendorGrammar(primitive: SymbolicPrimitive, vendor: VendorType): VendorGrammar | undefined {
  return primitive.vendorGrammars.find(grammar => grammar.vendor === vendor);
}

/**
 * Translate a symbolic operation from one vendor to another
 */
export function translateSymbolicOperation(
  content: string,
  sourceVendor: VendorType,
  targetVendor: VendorType
): string {
  // Implementation depends on specific parsing and generation logic
  // This would be implemented in the runtime library
  return content; // Placeholder
}
