// Google Sheets URL Tester
// This utility helps test if Google Sheets are publicly accessible

const SHEET_IDS = {
  sales: '1v-imyFcNfNR-Mr6gH9vccr2QaQc7oLSUc7ozPLoGgxQ',
  marketing: '1VN0h_3JYu7GtoX2Gh3ZfgNxiOcNDRE5OkRrt81UiAUc',
  finance: '1CQLg1Fep3MNB_tidEXdOtj1VQNz5YXUT2zRSv5j1GHA',
  hr: '1G2pZPZKrDz7A9Ez04-ltEPE4mVEg4iWw1qyLrtricM4',
  support: '1ydowbHKuYunpeYp73lVfRd-DjQ2FPmiXOj-nVbkkETU'
};

export const testGoogleSheetsAccess = async () => {
  const results: Record<string, any> = {};
  
  for (const [name, sheetId] of Object.entries(SHEET_IDS)) {
    console.log(`\n=== Testing ${name.toUpperCase()} Sheet ===`);
    
    const urls = [
      `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=0`,
      `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&gid=0`,
      `https://docs.google.com/spreadsheets/d/${sheetId}/pub?output=csv&gid=0`
    ];
    
    results[name] = { accessible: false, workingUrl: null, error: null };
    
    for (const url of urls) {
      try {
        console.log(`Trying: ${url}`);
        const response = await fetch(url, { 
          mode: 'cors',
          headers: {
            'Accept': 'text/csv',
          }
        });
        
        if (response.ok) {
          const text = await response.text();
          console.log(`✅ Success! Response length: ${text.length}`);
          console.log(`First 100 chars: ${text.substring(0, 100)}`);
          
          if (!text.includes('<!DOCTYPE') && !text.includes('<html') && text.length > 10) {
            results[name] = { 
              accessible: true, 
              workingUrl: url, 
              responseLength: text.length,
              firstLine: text.split('\n')[0]
            };
            break;
          } else {
            console.log('❌ Received HTML instead of CSV');
          }
        } else {
          console.log(`❌ HTTP ${response.status}: ${response.statusText}`);
        }
      } catch (error) {
        console.log(`❌ Error: ${error}`);
      }
    }
    
    if (!results[name].accessible) {
      console.log(`❌ ${name} sheet is not accessible via any URL`);
    }
  }
  
  return results;
};

// Instructions for making Google Sheets public
export const getPublicAccessInstructions = () => {
  return `
📋 HOW TO MAKE YOUR GOOGLE SHEETS PUBLIC:

1. Open your Google Sheet
2. Click "Share" button (top right)
3. Click "Change to anyone with the link"
4. Set permission to "Viewer"
5. Click "Copy link"
6. Make sure the sheet has data in the first row (headers)

🔗 Your sheet URLs should look like:
- Sales: https://docs.google.com/spreadsheets/d/1v-imyFcNfNR-Mr6gH9vccr2QaQc7oLSUc7ozPLoGgxQ/edit
- Marketing: https://docs.google.com/spreadsheets/d/1VN0h_3JYu7GtoX2Gh3ZfgNxiOcNDRE5OkRrt81UiAUc/edit
- Finance: https://docs.google.com/spreadsheets/d/1CQLg1Fep3MNB_tidEXdOtj1VQNz5YXUT2zRSv5j1GHA/edit
- HR: https://docs.google.com/spreadsheets/d/1G2pZPZKrDz7A9Ez04-ltEPE4mVEg4iWw1qyLrtricM4/edit
- Support: https://docs.google.com/spreadsheets/d/1ydowbHKuYunpeYp73lVfRd-DjQ2FPmiXOj-nVbkkETU/edit

⚠️ IMPORTANT: Each sheet must have:
- Column headers in the first row
- Data starting from the second row
- Public access (anyone with link can view)
`;
};