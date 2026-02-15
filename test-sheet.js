// Test the actual Marketing Google Sheet
const SHEET_ID = '1VN0h_3JYu7GtoX2Gh3ZfgNxiOcNDRE5OkRrt81UiAUc';

async function testSheet() {
  const urls = [
    `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=0`,
    `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&gid=0`,
    `https://docs.google.com/spreadsheets/d/${SHEET_ID}/pub?output=csv&gid=0`
  ];
  
  for (const url of urls) {
    try {
      console.log('Testing:', url);
      const response = await fetch(url);
      const text = await response.text();
      
      if (text.length > 50 && !text.includes('<!DOCTYPE')) {
        console.log('SUCCESS! Headers:', text.split('\n')[0]);
        console.log('First row:', text.split('\n')[1]);
        return;
      }
    } catch (e) {
      console.log('Failed:', e.message);
    }
  }
  console.log('All URLs failed');
}

testSheet();