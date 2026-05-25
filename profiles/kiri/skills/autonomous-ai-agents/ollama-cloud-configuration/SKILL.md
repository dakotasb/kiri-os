---
name: ollama-cloud-configuration
description: Configure and troubleshoot Ollama Cloud provider for Hermes agents, including model selection, API authentication, fallback chains, and fleet-wide model management.
triggers:
  - "ollama cloud model"
  - "configure ollama cloud"
  - "ollama cloud api key"
  - "ollama cloud provider"
  - "ollama base url"
  - "fix ollama authentication"
  - "ollama cloud models list"
  - "validate ollama model"
  - "ollama cloud fallback"
  - "hermes ollama cloud"
  - "fleet model configuration"
  - "agent model assignment"
  - "model diversity distribution"
tags: [ollama-cloud, model-configuration, provider-setup, api-authentication, fleet-management]
version: 1.0.0
---

# Ollama Cloud Configuration

Configure and troubleshoot Ollama Cloud provider for Hermes agents, including model selection, API authentication, fallback chains, and fleet-wide model management.

## Critical Pitfall: Model Naming

**Ollama Cloud REQUIRES full model names with parameter counts.**

❌ WRONG: `mistral-large-3`  
✅ CORRECT: `mistral-large-3:675b`

❌ WRONG: `deepseek-v3-0324` (invented name)  
✅ CORRECT: `deepseek-v4-pro` (actual API name)

**Always query the API first** to get exact model IDs.