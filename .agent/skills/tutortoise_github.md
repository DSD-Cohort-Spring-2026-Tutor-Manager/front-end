# GitHub & Pull Request Guidelines

## Git Interaction
- Ensure you have the latest `main` branch pulled before creating branches.
- Use standard descriptive branch naming, such as `fix/<issue>`, `feat/<feature>`, or `chore/<task>`.

## Pull Request Title Guidelines
PR titles MUST strictly follow this regex: `^(chore|feat|fix): #\d+ .+$`
Format: `<chore|feat|fix>: #<issue number> <description>`

**Examples:**
- `feat: #0 awesome feature sub storie a`
- `fix: #0 total disaster recovery`
- `chore: #0 refactor method names`

## Pull Request Body Guidelines
When creating a PR, the body formatting must exactly match the template below. Ensure the checklist is complete.

```markdown
## Issue ticket number and link
<!--I am an ivinisble comment line, do not delete me-->
<!--add your issue # below like this: #4 -->
#<issue_number>

## Summary of app behaviour change
<!--if applicable-->
<brief description>

## Summary of code change 
<brief description>

## Checklist before requesting a review
- [x] The title matches the regex `^(chore|feat|fix): #\d+ .+$`  
or format `<chore|feat|fix>: #<issue number> <description>`
eg1. feat: #0 awesome feature sub storie a  
eg2. fix: #0 total disaster recovery  
eg3. chore: #0 refactor method names
- [x] The App buils, runs and functions in local, if applicable
```