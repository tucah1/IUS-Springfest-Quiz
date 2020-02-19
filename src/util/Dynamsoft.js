import Dynamsoft from 'dynamsoft-javascript-barcode';
Dynamsoft.BarcodeReader.engineResourcePath =
    'https://cdn.jsdelivr.net/npm/dynamsoft-javascript-barcode@7.3.0-v1/dist/';
// Please visit https://www.dynamsoft.com/CustomerPortal/Portal/TrialLicense.aspx to get a trial license
Dynamsoft.BarcodeReader.productKeys =
    't0068NQAAAFbE1aTg5o0S7dr7OoBPPC5/1hVF5BqV/8kpBOjV25XZmubptpvZixsK4uMbPgqrv+QuV9jvNHmVOOLezDzD3Ww=';
// Dynamsoft.BarcodeReader._bUseFullFeature = true; // Control of loading min wasm or full wasm.
export default Dynamsoft;
