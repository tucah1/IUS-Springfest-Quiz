import Dynamsoft from 'dynamsoft-javascript-barcode';
Dynamsoft.BarcodeReader.engineResourcePath =
    'https://cdn.jsdelivr.net/npm/dynamsoft-javascript-barcode@7.3.0-v1/dist/';
// Please visit https://www.dynamsoft.com/CustomerPortal/Portal/TrialLicense.aspx to get a trial license
Dynamsoft.BarcodeReader.productKeys =
    't0068NQAAAJpb3ttrXAuqr7CZmlPaCgRyYoNxEAI0FlAWAJOP2hgsJez/fyZl3QtfQpYosGRt1CYN2UIU1FjDietOL3qAZE0=';
// Dynamsoft.BarcodeReader._bUseFullFeature = true; // Control of loading min wasm or full wasm.
export default Dynamsoft;
