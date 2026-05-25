---
name: security-architecture-review
description: Systematic security assessment of software architecture documentation to identify vulnerabilities, assess risks, and provide remediation recommendations. Focuses on architecture/specification level threats, not code-level issues.
triggers:
  - "security review of architecture"
  - "threat modeling"
  - "security assessment"
  - "security audit"
  - "identify security risks"
  - "architecture security patterns"
  - "security best practices review"
  - "vulnerability assessment"
version: 1.0.0
tags: [security, architecture, threat-modeling, risk-assessment, vulnerability, compliance]
related_skills: [implementation-status-audit, requesting-code-review, systematic-debugging]
---

# Security Architecture Review

Systematic assessment of software architecture documentation to identify security vulnerabilities, assess risks, and provide structured remediation recommendations.

## When to Use

- After major architecture changes or new system designs
- Before implementation begins on security-critical components
- When reviewing existing architecture documentation for compliance
- As part of regular security audit cycles
- When user requests "security review" or "threat modeling"

## Methodology

### Step 1: Document Collection

Gather all relevant architecture documentation:
```python
# Core architecture files
read_file("~/command_center/architecture/ARCHITECTURE.md")
read_file("~/command_center/architecture/PERSISTENCE_PATTERNS.md")  
read_file("~/command_center/architecture/agent-os-integration-design.md")

# Additional relevant files
search_files(pattern=".*security.*", path="~/command_center", target="files")
search_files(pattern=".*auth.*", path="~/command_center", target="files")
search_files(pattern=".*api.*", path="~/command_center", target="files")
```

### Step 2: Threat Identification Framework

Analyze documentation against these security domains:

#### A. Authentication & Authorization
- Missing authentication mechanisms
- Inadequate authorization controls
- Privilege escalation risks
- Session management issues

#### B. Input Validation & Sanitization  
- Unvalidated user input
- Missing XSS protection
- No CSP headers
- Injection vulnerability patterns

#### C. Data Protection
- Unencrypted sensitive data
- Missing data validation
- Improper data handling
- Privacy compliance gaps

#### D. Communication Security
- Unauthenticated APIs/event buses
- Missing message validation
- No rate limiting
- Transport security issues

#### E. System Integration
- Third-party service risks
- Cross-system trust issues
- Integration point vulnerabilities
- Service mesh security

### Step 3: Risk Assessment Matrix

Rate each identified concern using this severity scale:

**CRITICAL**: Immediate compromise, data breach, system takeover
**HIGH**: Significant security impact, privilege escalation  
**MEDIUM**: Moderate security impact, requires specific conditions
**LOW**: Minor security impact, information disclosure only

### Step 4: Structured Reporting

Create comprehensive JSON report with:
```json
{
  "security_concerns": [
    {
      "concern": "Description of security issue",
      "severity": "CRITICAL|HIGH|MEDIUM|LOW", 
      "description": "Detailed explanation of the vulnerability",
      "recommendations": ["Remediation action 1", "Action 2"],
      "references": ["ARCHITECTURE.md §X.Y", "Other doc references"]
    }
  ],
  "security_best_practices": [
    {
      "pattern": "Positive security pattern identified",
      "severity": "LOW",
      "description": "Explanation of why this is a good practice",
      "recommendations": ["Continue/enhance this pattern"],
      "references": ["Document references"]
    }
  ],
  "overall_assessment": "Summary of security posture",
  "model_used": "Model name for traceability",
  "reviewer": "Security agent name",
  "timestamp": "ISO timestamp"
}
```

### Step 5: Delivery

Save report to specified location:
```python
write_file(
    path="~/command_center/security_review.json",
    content=json_report
)
```

## Common Security Patterns to Identify

### Architecture-Level Threats

**Event Bus Security**:
- Missing authentication for pub/sub systems
- No message signing/validation
- Lack of rate limiting
4- Privilege escalation via event injection

**API Security**:
- Unauthenticated endpoints
- Missing input validation
- No rate limiting
- Inadequate error handling

**Data Flow Security**:
- Sensitive data in plaintext
- Missing encryption requirements
- Inadequate access controls
- Privacy compliance gaps

### Positive Security Patterns

**Defense in Depth**:
- Multiple layers of security controls
- Redundant validation mechanisms
- Fail-secure defaults

**Principle of Least Privilege**:
- Minimal necessary permissions
- Role-based access control
- Proper privilege separation

**Secure Defaults**:
- Security-by-design approach
- Default-deny posture
- Automatic security controls

## Integration with Other Skills

**implementation-status-audit**: Use when security architecture exists but implementation differs
**requesting-code-review**: Use for code-level security verification after implementation
**systematic-debugging**: Use when investigating specific security incidents

## Example Output Structure

```json
{
  "security_concerns": [
    {
      "concern": "Insufficient input sanitization",
      "severity": "HIGH", 
      "description": "Architecture lacks user input sanitization mechanisms and XSS protection",
      "recommendations": [
        "Implement HTML sanitization library",
        "Add Content Security Policy headers",
        "Validate all agent payloads",
        "Implement rate limiting"
      ],
      "references": ["ARCHITECTURE.md §7.1"]
    }
  ],
  "security_best_practices": [
    {
      "pattern": "Persistence-scoped agent deployment",
      "severity": "LOW",
      "description": "Proper isolation between ephemeral and persistent agents prevents data leakage",
      "recommendations": ["Continue enforcing clear persistence boundaries"],
      "references": ["PERSISTENCE_PATTERNS.md §1"]
    }
  ],
  "overall_assessment": "Good foundational security thinking but critical web security controls missing",
  "model_used": "deepseek-v3.1:671b",
  "reviewer": "Bastion",
  "timestamp": "2026-05-06T02:46:00Z"
}
```

## Pitfalls to Avoid

- Don't confuse architecture-level issues with implementation bugs
- Focus on systemic patterns, not individual code lines
- Document both vulnerabilities AND positive patterns
- Provide actionable, specific recommendations
- Include proper severity ratings with justification
- Reference specific document sections for traceability

## Version History

v1.0.0 - Initial security architecture review methodology for systematic threat modeling and risk assessment