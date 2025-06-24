# SVG Upload Feature Assessment

**Date:** 2025-06-23  
**Status:** Parked for future consideration  
**Complexity:** Medium (3-4 days development)

## Executive Summary

Assessment of implementing user-uploaded SVG files for custom icons in the Taschengeld family allowance tracker. The feature would allow parents to upload custom SVG files for tasks and user profiles, extending beyond the current predefined icon system.

## Current System Analysis

### Existing Icon Infrastructure

**Static SVG System:**

- 300+ predefined SVG files in `/public/icons/`
- Consistent naming convention (kebab-case)
- Used throughout the application for tasks and UI elements

**Dynamic Icon System:**

- `IconComponent.tsx`: Converts string names to Lucide React icons
- `SelectIconModal.tsx`: 140+ task-specific icons for task selection
- `IconSelectorModal.tsx`: User-focused icons for profile avatars
- Database storage: Icon names stored as strings in `icon_name` fields

**Technical Foundation:**

- Next.js 15 with App Router
- TypeScript with Zod validation
- Prisma ORM with PostgreSQL
- Docker-first development environment
- No existing file upload infrastructure

## Implementation Analysis

### Difficulty Assessment: **Medium**

**Factors Increasing Complexity:**

1. **New Infrastructure Requirements**

   - File upload system (no current multer/formidable dependencies)
   - SVG validation and sanitization pipeline
   - File storage management (local filesystem or cloud)
   - Database schema extensions

2. **Security Considerations**

   - SVG sanitization to prevent XSS attacks
   - File size and format validation
   - MIME type verification
   - Malicious content detection

3. **Integration Complexity**
   - Extending existing icon selection modals
   - Custom icon management UI
   - Fallback handling for missing files
   - Database migration planning

**Factors Reducing Complexity:**

1. **Solid Foundation**

   - Well-structured icon component system
   - Clear separation of concerns
   - Consistent naming conventions
   - Docker environment for testing

2. **Modern Stack Benefits**
   - Next.js API routes for upload endpoints
   - TypeScript for type safety
   - Prisma for database operations
   - Existing modal component patterns

## Proposed Implementation Plan

### Phase 1: Upload Infrastructure (1-2 days)

**Dependencies:**

```bash
npm install multer @types/multer
# OR
npm install formidable @types/formidable
```

**API Endpoint:**

- `/api/upload/svg` - Handle SVG file uploads
- File validation (size limits, MIME type, SVG structure)
- SVG sanitization using libraries like `dompurify` or `svg-sanitizer`
- Local filesystem storage in Docker volumes

**Security Measures:**

- Maximum file size limit (e.g., 100KB)
- SVG content sanitization
- Filename sanitization and UUID generation
- MIME type verification

### Phase 2: Database Integration (1 day)

**Schema Extensions:**

```prisma
model CustomIcon {
  icon_id     Int      @id @default(autoincrement())
  filename    String   @unique @db.VarChar(255)
  original_name String @db.VarChar(255)
  file_path   String   @db.VarChar(500)
  file_size   Int
  mime_type   String   @db.VarChar(50)
  uploaded_at DateTime @default(now()) @db.Timestamptz(6)
  is_active   Boolean  @default(true)

  @@map("custom_icons")
}
```

**Icon Component Updates:**

- Extend `IconComponent.tsx` to handle custom SVG file paths
- Add custom icon resolution logic
- Implement fallback for missing custom icons

### Phase 3: UI Components (1 day)

**Upload Interface:**

- File drop zone component with drag/drop functionality
- SVG preview with size/dimension display
- Upload progress and validation feedback
- Error handling for invalid files

**Icon Selection Updates:**

- Add "Custom Icons" tab to existing modals
- Grid display of uploaded custom icons
- Custom icon management (delete, rename)
- Integration with `SelectIconModal` and `IconSelectorModal`

## Technical Considerations

### File Storage Strategy

**Development:**

- Local filesystem storage in Docker volumes
- Mapped to `/app/uploads/custom-icons/` in container
- Volume persistence across container restarts

**Production:**

- Consider cloud storage (AWS S3, Google Cloud Storage)
- CDN integration for performance
- Backup strategy for custom icons

### Security Implementation

**SVG Sanitization:**

```typescript
// Example sanitization approach
import DOMPurify from 'dompurify';

function sanitizeSVG(svgContent: string): string {
  return DOMPurify.sanitize(svgContent, {
    USE_PROFILES: { svg: true, svgFilters: true },
  });
}
```

**Validation Pipeline:**

1. File extension check (.svg only)
2. MIME type verification (image/svg+xml)
3. File size limits (max 100KB)
4. SVG structure validation
5. Content sanitization
6. Malicious pattern detection

### Performance Considerations

**Optimization Strategies:**

- Image optimization for large SVGs
- Caching headers for custom icon requests
- Lazy loading in icon selection grids
- Cleanup of unused custom icons

## Risk Assessment

### Security Risks

- **XSS via SVG**: Malicious scripts embedded in SVG files
- **File system attacks**: Path traversal or directory manipulation
- **Storage exhaustion**: Unlimited uploads consuming disk space

### Mitigation Strategies

- Comprehensive SVG sanitization
- Strict file validation and limits
- Sandboxed file storage locations
- Regular cleanup of orphaned files

### Operational Risks

- **Storage management**: Custom icons not included in standard backups
- **Migration complexity**: Custom icons complicate deployment
- **Performance impact**: Large number of custom icons affecting load times

## Integration Points

### Existing Components to Modify

1. `components/icon-component.tsx` - Add custom SVG support
2. `components/select-icon-modal.tsx` - Add custom icons tab
3. `components/icon-selector-modal.tsx` - Add custom icons tab
4. Database schema and migrations
5. Backup/restore system (include custom icons)

### New Components Required

1. `components/svg-upload-modal.tsx` - File upload interface
2. `components/custom-icon-manager.tsx` - Icon management UI
3. `app/api/upload/svg/route.ts` - Upload endpoint
4. `app/api/custom-icons/route.ts` - Icon management API

## Effort Estimation

**Total: 3-4 development days**

- **Day 1-2**: Upload infrastructure and security implementation
- **Day 3**: Database integration and API development
- **Day 4**: UI components and testing

**Additional considerations:**

- Testing across Docker environments (+0.5 days)
- Documentation and security review (+0.5 days)
- Production deployment considerations (+0.5 days)

## Recommendation

**Status: Viable but medium complexity**

The SVG upload feature is technically feasible and would integrate well with the existing codebase. The Taschengeld project's solid architectural foundation and Docker-first development approach provide a good foundation for this enhancement.

**Key success factors:**

1. Proper security implementation with SVG sanitization
2. Integration with existing icon selection patterns
3. Robust file storage and backup strategy
4. Performance optimization for icon loading

**Parking rationale:**
While the feature is implementable with medium effort, it requires careful security consideration and introduces additional system complexity. The current predefined icon system meets core functionality needs, making this an enhancement rather than a critical requirement.

## Future Considerations

When revisiting this feature:

1. Evaluate user demand for custom icons
2. Consider cloud storage integration for production
3. Assess impact on backup/restore workflows
4. Review security landscape for SVG handling
5. Consider icon sharing between family members
6. Explore icon categories and organization features

---

**Document Version:** 1.0  
**Last Updated:** 2025-06-23  
**Next Review:** When feature is prioritized for development
