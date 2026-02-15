// Test Marketing Google Sheet Access
const SHEET_ID = '1VN0h_3JYu7GtoX2Gh3ZfgNxiOcNDRE5OkRrt81UiAUc';
const SHEET_URLS = [
  `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=0`,
  `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&gid=0`,
  `https://docs.google.com/spreadsheets/d/${SHEET_ID}/pub?output=csv&gid=0`
];

async function testMarketingSheet() {
  console.log('Testing Marketing Google Sheet access...');
  
  for (let i = 0; i < SHEET_URLS.length; i++) {
    const url = SHEET_URLS[i];
    console.log(`\n--- Testing URL ${i + 1}: ---`);
    console.log(url);
    
    try {
      const response = await fetch(url);
      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      
      const text = await response.text();
      console.log('Response length:', text.length);
      
      if (text.includes('<!DOCTYPE') || text.includes('<html')) {
        console.log('❌ Received HTML - Sheet not public or accessible');
        continue;
      }
      
      if (text.length < 10) {
        console.log('❌ Response too short - likely empty or error');
        continue;
      }
      
      const lines = text.trim().split('\n');
      console.log('✅ CSV received with', lines.length, 'lines');
      
      if (lines.length > 0) {
        console.log('Headers:', lines[0]);
        const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, '').toLowerCase());
        console.log('Parsed headers:', headers);
      }
      
      if (lines.length > 1) {
        console.log('First data row:', lines[1]);
        const values = lines[1].split(',');
        console.log('First row values count:', values.length);
      }
      
      if (lines.length > 2) {
        console.log('Second data row:', lines[2]);
      }
      
      console.log('✅ SUCCESS - This URL works!');
      return;
      
    } catch (error) {
      console.log('❌ Error:', error.message);
    }
  }
  
  console.log('\n❌ All URLs failed. Please check:');
  console.log('1. Is the Google Sheet public?');
  console.log('2. Does the sheet have data?');
  console.log('3. Is the Sheet ID correct?');
}

// Run this in browser console
testMarketingSheet();