#!/usr/bin/env python3
"""
Intelligent Release Notes Generator for Taschengeld
Analyzes git commits and generates user-friendly release notes
"""

import subprocess
import re
import json
import sys
from typing import List, Dict, Tuple
from datetime import datetime

class ReleaseNotesGenerator:
    def __init__(self, current_version: str, previous_version: str = None):
        self.current_version = current_version
        self.previous_version = previous_version or self._get_previous_version()
        
        # Patterns to categorize commits
        self.patterns = {
            'features': [
                r'^feat(?:\([^)]+\))?: (.+)',
                r'^add(?:\([^)]+\))?: (.+)', 
                r'^implement(?:\([^)]+\))?: (.+)',
                r'[Aa]dd .* functionality',
                r'[Ii]mplement .* feature',
                r'[Nn]ew .* feature'
            ],
            'fixes': [
                r'^fix(?:\([^)]+\))?: (.+)',
                r'^bugfix(?:\([^)]+\))?: (.+)',
                r'[Ff]ix .* (bug|issue|error|problem)',
                r'[Rr]esolve .* (bug|issue|error)',
                r'[Cc]orrect .* (issue|problem)'
            ],
            'ui_improvements': [
                r'^ui(?:\([^)]+\))?: (.+)',
                r'^ux(?:\([^)]+\))?: (.+)',
                r'[Uu]pdate .* (UI|interface|design)',
                r'[Ii]mprove .* (UI|UX|interface)',
                r'[Ee]nhance .* (appearance|styling|layout)'
            ],
            'infrastructure': [
                r'^docker(?:\([^)]+\))?: (.+)',
                r'^ci(?:\([^)]+\))?: (.+)',
                r'^build(?:\([^)]+\))?: (.+)',
                r'[Uu]pdate .* (Docker|CI|build)',
                r'[Ii]mprove .* (deployment|infrastructure)'
            ],
            'performance': [
                r'^perf(?:\([^)]+\))?: (.+)',
                r'[Oo]ptimize .+',
                r'[Ii]mprove .* performance',
                r'[Ss]peed up .+'
            ],
            'docs': [
                r'^docs(?:\([^)]+\))?: (.+)',
                r'[Uu]pdate .* (documentation|README|docs)',
                r'[Aa]dd .* documentation'
            ]
        }

    def _get_previous_version(self) -> str:
        """Get the previous git tag/version"""
        try:
            result = subprocess.run(
                ['git', 'describe', '--tags', '--abbrev=0', 'HEAD~1'],
                capture_output=True, text=True, check=True
            )
            return result.stdout.strip()
        except subprocess.CalledProcessError:
            # If no previous tag, use first commit
            result = subprocess.run(
                ['git', 'rev-list', '--max-parents=0', 'HEAD'],
                capture_output=True, text=True, check=True
            )
            return result.stdout.strip()[:8]

    def _get_commits_since_version(self) -> List[str]:
        """Get commit messages since previous version"""
        try:
            if self.previous_version.startswith('v'):
                range_spec = f"{self.previous_version}..HEAD"
            else:
                range_spec = f"{self.previous_version}..HEAD"
            
            result = subprocess.run([
                'git', 'log', range_spec, '--pretty=format:%s', '--no-merges'
            ], capture_output=True, text=True, check=True)
            
            commits = [line.strip() for line in result.stdout.split('\n') if line.strip()]
            # Filter out version bump commits
            commits = [c for c in commits if not re.match(r'^🔖 Bump version', c)]
            return commits
        except subprocess.CalledProcessError as e:
            print(f"Error getting commits: {e}", file=sys.stderr)
            return []

    def _categorize_commit(self, commit: str) -> Tuple[str, str]:
        """Categorize a commit message and extract user-friendly description"""
        
        for category, patterns in self.patterns.items():
            for pattern in patterns:
                match = re.search(pattern, commit, re.IGNORECASE)
                if match:
                    if match.groups():
                        # Extract description from capture group
                        description = match.group(1).strip()
                    else:
                        # Use the whole commit message
                        description = commit.strip()
                    
                    return category, self._humanize_description(description, category)
        
        # Default category for unmatched commits
        return 'other', self._humanize_description(commit, 'other')

    def _humanize_description(self, description: str, category: str) -> str:
        """Convert technical commit message to user-friendly description"""
        
        # Clean up common technical prefixes
        description = re.sub(r'^(feat|fix|add|update|improve|enhance|implement):\s*', '', description, flags=re.IGNORECASE)
        description = re.sub(r'^\w+\([^)]+\):\s*', '', description)  # Remove scope like "feat(api):"
        
        # Capitalize first letter
        if description:
            description = description[0].upper() + description[1:]
        
        # Add context based on category
        context_improvements = {
            'features': lambda d: d if 'functionality' in d.lower() or 'feature' in d.lower() else d,
            'fixes': lambda d: d if 'fix' in d.lower() or 'error' in d.lower() else f"Fixed issue with {d.lower()}",
            'ui_improvements': lambda d: d if any(word in d.lower() for word in ['ui', 'interface', 'design', 'styling']) else f"Improved {d.lower()}",
            'infrastructure': lambda d: d,
            'performance': lambda d: d if 'performance' in d.lower() else f"Improved performance of {d.lower()}",
            'docs': lambda d: d if 'documentation' in d.lower() else f"Updated documentation for {d.lower()}"
        }
        
        if category in context_improvements:
            description = context_improvements[category](description)
        
        # Ensure it ends with appropriate punctuation
        if not description.endswith('.') and not description.endswith('!'):
            description += ''
        
        return description

    def generate_release_notes(self) -> str:
        """Generate formatted release notes"""
        commits = self._get_commits_since_version()
        
        if not commits:
            return self._generate_minimal_notes()
        
        # Categorize all commits
        categorized = {
            'features': [],
            'fixes': [],
            'ui_improvements': [],
            'infrastructure': [],
            'performance': [],
            'docs': [],
            'other': []
        }
        
        for commit in commits:
            category, description = self._categorize_commit(commit)
            if description and description not in [item['description'] for item in categorized[category]]:
                categorized[category].append({
                    'description': description,
                    'commit': commit
                })
        
        return self._format_release_notes(categorized)

    def _format_release_notes(self, categorized: Dict[str, List[Dict]]) -> str:
        """Format categorized commits into release notes"""
        notes = f"## 🚀 Release v{self.current_version}\n\n"
        
        # Define sections with emojis and user-friendly titles
        sections = [
            ('features', '✨ New Features', 'New functionality and capabilities added to the app'),
            ('fixes', '🔧 Bug Fixes', 'Issues resolved and problems corrected'),
            ('ui_improvements', '🎨 UI/UX Improvements', 'Visual and interaction enhancements'),
            ('performance', '⚡ Performance', 'Speed and efficiency improvements'),
            ('infrastructure', '🐳 Infrastructure', 'Development and deployment improvements'),
            ('docs', '📚 Documentation', 'Documentation updates and improvements')
        ]
        
        has_content = False
        for category, title, description in sections:
            items = categorized.get(category, [])
            if items:
                has_content = True
                notes += f"### {title}\n"
                for item in items:
                    notes += f"- **{item['description']}**\n"
                notes += "\n"
        
        # Add other changes if any
        if categorized.get('other'):
            has_content = True
            notes += "### 📝 Other Changes\n"
            for item in categorized['other']:
                notes += f"- {item['description']}\n"
            notes += "\n"
        
        if not has_content:
            notes += "### 📝 Changes\n- Version maintenance and minor updates\n\n"
        
        # Add standard footer sections
        notes += self._add_standard_sections()
        
        return notes

    def _add_standard_sections(self) -> str:
        """Add standard sections like Docker images, installation, etc."""
        return f"""### 📦 Docker Images
- `docker pull groovycodexyz/taschengeld:v{self.current_version}`
- `docker pull groovycodexyz/taschengeld:latest`

### 🏗️ Multi-Architecture Support
- ✅ linux/amd64 (Intel/AMD processors)
- ✅ linux/arm64 (Apple Silicon, ARM processors)

### 📥 Installation
```bash
# Pull latest version
docker pull groovycodexyz/taschengeld:v{self.current_version}

# Or use latest tag
docker pull groovycodexyz/taschengeld:latest
```

For full setup instructions, see: https://taschengeld.groovycode.xyz

---
🤖 Generated with [Claude Code](https://claude.ai/code)"""

    def _generate_minimal_notes(self) -> str:
        """Generate minimal notes when no commits found"""
        return f"""## 🚀 Release v{self.current_version}

### 📝 Changes
- Version maintenance and minor updates

{self._add_standard_sections()}"""

def main():
    if len(sys.argv) < 2:
        print("Usage: python generate-release-notes.py <version> [previous_version]", file=sys.stderr)
        sys.exit(1)
    
    current_version = sys.argv[1]
    previous_version = sys.argv[2] if len(sys.argv) > 2 else None
    
    generator = ReleaseNotesGenerator(current_version, previous_version)
    notes = generator.generate_release_notes()
    
    print(notes)

if __name__ == "__main__":
    main()