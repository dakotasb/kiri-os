# Ollama Cloud Model Reference

## Model Naming Convention

**CRITICAL**: Ollama Cloud uses **full model names with parameter counts**.

❌ **WRONG**: `mistral-large-3`  
✅ **CORRECT**: `mistral-large-3:675b`

## Available Models (39 Total)

| Model | ID | Best For |
|-------|-----|----------|
| Kimi 2.5 | `kimi-k2.5` | General reasoning, context handling |
| Kimi 2.6 | `kimi-k2.6` | Vision, creative tasks |
| Kimi 2 (1T) | `kimi-k2:1t` | Large context windows |
| Kimi 2 Thinking | `kimi-k2-thinking` | Step-by-step reasoning |
| DeepSeek V4 Pro | `deepseek-v4-pro` | Coding, architecture |
| DeepSeek V4 Flash | `deepseek-v4-flash` | Fast responses |
| DeepSeek V3.1 | `deepseek-v3.1:671b` | Reasoning |
| DeepSeek V3.2 | `deepseek-v3.2` | Balanced |
| Mistral Large 3 | `mistral-large-3:675b` | Multilingual, instructions |
| Mistral Small | `ministral-3:3b/8b/14b` | Fast tasks |
| Qwen 3.5 | `qwen3.5:397b` | Coding, Qwen ecosystem |
| Qwen 3 VL | `qwen3-vl:235b` | Vision-language |
| Qwen 3 Coder | `qwen3-coder:480b` | Programming |
| Gemma 3 | `gemma3:4b/12b/27b` | Google ecosystem |
| Gemma 4 | `gemma4:31b` | Advanced |
| GLM Series | `glm-4.6/4.7/5/5.1` | Multilingual |
| GPT OSS | `gpt-oss:20b/120b` | Open models |
| MiniMax | `minimax-m2/m2.1/m2.5/m2.7` | Chinese |
| Nemotron | `nemotron-3-nano/super` | NVIDIA |
| Devstral | `devstral-2:123b` | Developer focus |
| Cogito | `cogito-2.1:671b` | Reasoning |
| RNJ | `rnj-1:8b` | Experimental |

## Common Mistakes

### Simplified Names (❌)
Do NOT use simplified/truncated names:

- `mistral-large-3` → Use `mistral-large-3:675b`
- `qwen3` → Use `qwen3.5:397b` or `qwen3:235b`
- `deepseek-v3` → Use `deepseek-v3.2` or `deepseek-v3.1:671b`
- `gemma3` → Use `gemma3:27b` (specify size)

### Invalid/Invented Names (❌)
These names don't exist in Ollama Cloud API:

- `claude-sonnet-4-20250514` → Not available, use `kimi-k2.5`
- `deepseek-v4-pro` → Use full API names from list above
- `devstral-2:123b` → Valid but check availability

## Verification

```bash
# Query available models
curl -s https://ollama.com/v1/models \
  -H "Authorization: Bearer $OLLAMA_API_KEY" | \
  jq '.data[].id'
```

## Persona-Model Mapping

Based on capability strengths:

| Agent Type | Recommended Model | Fallbacks |
|------------|-------------------|-----------|
| Coding/Technical | `deepseek-v4-pro` | `deepseek-v4-flash`, `kimi-k2.5` |
| Design/Creative | `kimi-k2.6` | `kimi-k2.5`, `deepseek-v4-flash` |
| Writing/Content | `kimi-k2.5` | `kimi-k2.6`, `gemma3:27b` |
| Security/Monitoring | `mistral-large-3:675b` | `kimi-k2.5`, `deepseek-v4-flash` |
| Data/Storage | `qwen3.5:397b` | `qwen3:235b`, `kimi-k2.5` |
| General/Orchestration | `kimi-k2.5` | `kimi-k2.6`, `deepseek-v4-flash` |

## Fallback Chains

Always provide 2 fallback models in this order:
1. **Primary**: Best model for the persona
2. **Fallback 1**: Alternative from same family
3. **Fallback 2**: Reliable fallback from different family

Example:
```yaml
model: deepseek-v4-pro
fallback_models:
  - deepseek-v4-flash
  - kimi-k2.5
```