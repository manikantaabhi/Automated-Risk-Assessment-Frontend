import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(items: any[], searchText: string): any[] {
    if (!items || !searchText) {
      return items; // If no items or no search text, return the original list
    }

    searchText = searchText.toLowerCase(); // Convert search text to lowercase

    return items.filter(item => {
      // Safely check if each property exists and is not undefined
      return (
        (item.softwareName && item.softwareName.toLowerCase().includes(searchText)) ||
        (item.cveId && item.cveId.toLowerCase().includes(searchText)) ||
        (item.severity && item.severity.toLowerCase().includes(searchText)) ||
        (item.description && item.description.toLowerCase().includes(searchText))
      );
    });
  }
}
