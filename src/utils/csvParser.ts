import { Lead } from '../types';

export function parseCSV(file: File): Promise<Lead[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = function(e) {
      const text = e.target?.result as string;
      const lines = text.split('\n');
      const newLeads: Lead[] = [];
      
      // Skip header row if it exists
      const startIndex = lines[0].includes('Nome') || lines[0].includes('NOME') ? 1 : 0;
      
      // Get current date for days calculation
      const currentDate = new Date();
      
      for (let i = startIndex; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line) {
          // Handle both comma and tab delimited files
          let parts: string[];
          if (line.includes('\t')) {
            parts = line.split('\t');
          } else {
            parts = line.split(',');
          }
          
          if (parts.length >= 4) {
            const name = parts[0].trim();
            const cpf = parts[1].trim();
            const phone = parts[2].trim();
            
            // Extract the value from the string, handling various formats
            let valueStr = parts[3].trim();
            
            // Extract just the numeric part from the value string
            const valueMatch = valueStr.match(/[0-9.,]+/g);
            let numValue = 0;
            
            if (valueMatch && valueMatch.length > 0) {
              // Get the first match and clean it up
              let cleanValue = valueMatch[0].trim();
              
              // Handle different number formats
              if (cleanValue.includes(',') && !cleanValue.includes('.')) {
                // Format: 1234,56
                numValue = parseFloat(cleanValue.replace(',', '.'));
              } else if (cleanValue.includes('.') && !cleanValue.includes(',')) {
                // Format: 1234.56
                numValue = parseFloat(cleanValue);
              } else if (cleanValue.includes(',') && cleanValue.includes('.')) {
                // Format: 1.234,56
                numValue = parseFloat(cleanValue.replace(/\./g, '').replace(',', '.'));
              } else {
                // Format: 1234
                numValue = parseFloat(cleanValue);
              }
            }
            
            // Ensure we have a valid number and format it properly
            const formattedValue = isNaN(numValue) ? "0,00" : numValue.toFixed(2).replace('.', ',');
            
            newLeads.push({
              id: 'lead_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
              name: name,
              cpf: cpf,
              phone: phone,
              value: formattedValue,
              status: 'pending',
              importDate: currentDate,
              days: 0
            });
          }
        }
      }
      
      resolve(newLeads);
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
}