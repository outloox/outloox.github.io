Java.perform(function() {
    console.log("[*] Frida script loaded. Waiting for the app to decrypt config...");

    try {
        const AESGCMDecoder = Java.use('f5.a');
        console.log("[+] Found target class: f5.a");

        AESGCMDecoder.a.overload('[B', '[B', '[B').implementation = function(arg1, arg2, arg3) {
            console.log("\n\n[+] >>> AES/GCM DECRYPTION INTERCEPTED! <<<");
            
            console.log("  [*] Argument 1 (likely Encrypted Data): " + bytesToHex(arg1));
            console.log("  [*] Argument 2 (likely Key): " + bytesToHex(arg2) + " | Text: " + bytesToString(arg2));
            console.log("  [*] Argument 3 (likely IV): " + bytesToHex(arg3) + " | Text: " + bytesToString(arg3));
            
            const decryptedData = this.a(arg1, arg2, arg3);
            
            console.log("\n  [SUCCESS] Decrypted Data (hex): " + bytesToHex(decryptedData));
            try {
                let resultText = bytesToString(decryptedData);
                let parsedJson = JSON.parse(resultText);
                console.log("  [SUCCESS] Decrypted JSON Content: \n" + JSON.stringify(parsedJson, null, 2));
            } catch (e) {
                console.log("  [INFO] Decrypted data is not a valid JSON. Printing as raw text:");
                console.log("  [SUCCESS] Decrypted Raw Text: \n" + bytesToString(decryptedData));
            }
            
            return decryptedData;
        };
        console.log("[+] Hook set on f5.a.a. Please trigger the action in the app.");

    } catch (error) {
        console.error("[!] Failed to hook class or method. Error: " + error);
    }
});

// Helper functions
function bytesToHex(arr) {
    if (!arr) return "null";
    return Array.prototype.map.call(new Uint8Array(arr), x => ('00' + x.toString(16)).slice(-2)).join('');
}
function bytesToString(arr) {
    if (!arr) return "null";
    try {
        return String.fromCharCode.apply(null, new Uint8Array(arr));
    } catch (e) {
        return "Error decoding bytes to string.";
    }
}
