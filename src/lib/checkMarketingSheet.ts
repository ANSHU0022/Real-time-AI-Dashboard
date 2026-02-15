// Quick utility to check Marketing Google Sheet structure
const SHEET_ID = '1VN0h_3JYu7GtoX2Gh3ZfgNxiOcNDRE5OkRrt81UiAUc';
const SHEET_URLS = [
  `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=0`,
  `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&gid=0`,
  `https://docs.google.com/spreadsheets/d/${SHEET_ID}/pub?output=csv&gid=0`
];

async function checkSheet() {
  for (const url of SHEET_URLS) {
    try {
      console.log('Checking URL:', url);
      const response = await fetch(url);
      const text = await response.text();
      
      if (text.includes('<!DOCTYPE') || text.includes('<html')) {
        console.log('HTML response - sheet not public');
        continue;
      }
      
      const lines = text.trim().split('\n');
      if (lines.length > 0) {
        console.log('Headers:', lines[0]);
        if (lines.length > 1) {
          console.log('First row:', lines[1]);
        }
        console.log('Total rows:', lines.length);
        return;
      }
    } catch (err) {
      console.log('Error:', err);
    }
  }
}

// Run in browser console
checkSheet();