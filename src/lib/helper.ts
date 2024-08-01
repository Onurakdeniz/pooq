 

export function titleToSlug(title: string, id: number): string {
    const slugTitle = title
      .toLowerCase()
      .replace(/[:]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-')
      .trim()
      .replace(/^-+|-+$/g, '');
  
    return `/${slugTitle}--${id}`;
  }

