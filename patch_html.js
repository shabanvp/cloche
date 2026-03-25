const fs = require('fs');
let content = fs.readFileSync('public/boutiqueproducts.html', 'utf8');

const searchStr1 = `        // Use the in-memory selected files
        selectedFiles.forEach(fileObj => {
          formData.append('images', fileObj.file);
        });`;

const replaceStr1 = `        // ----------------------------------------------------
        // CLOUDINARY UPLOAD LOGIC
        // ----------------------------------------------------
        const cloudinaryUrls = [];
        const CLOUDINARY_CLOUD_NAME = 'dycwsnzyd';
        // IMPORTANT: Replace this with your actual unsigned upload preset
        const CLOUDINARY_UPLOAD_PRESET = 'unsigned_preset';

        const submitBtn = document.querySelector('#addProductForm button[type="submit"]');
        const originalBtnText = submitBtn.textContent;

        if (selectedFiles.length > 0) {
          submitBtn.textContent = 'Uploading Images (Cloudinary)...';
          submitBtn.disabled = true;

          try {
            // Upload selected images to Cloudinary concurrently
            await Promise.all(selectedFiles.map(async (fileObj) => {
              const uploadData = new FormData();
              uploadData.append("file", fileObj.file);
              uploadData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

              const cloudRes = await fetch(\`https://api.cloudinary.com/v1_1/\${CLOUDINARY_CLOUD_NAME}/image/upload\`, {
                method: "POST",
                body: uploadData,
              });
              
              const cloudResult = await cloudRes.json();
              if (cloudResult.secure_url) {
                cloudinaryUrls.push(cloudResult.secure_url);
              } else {
                console.error("Cloudinary error:", cloudResult);
                throw new Error(cloudResult.error?.message || "Failed to upload to Cloudinary");
              }
            }));
          } catch (cloudErr) {
            console.error(cloudErr);
            alert("Image upload failed: " + cloudErr.message + ". Check your Cloudinary Cloud Name and Upload Preset in the code.");
            submitBtn.textContent = originalBtnText;
            submitBtn.disabled = false;
            return;
          }
          submitBtn.textContent = 'Saving Product...';
        }

        if (cloudinaryUrls.length > 0) {
          formData.append('imageUrls', JSON.stringify(cloudinaryUrls));
        }`;

const searchStr2 = `            document.querySelector('#addProductModal h3').textContent = "Add New Product";
            document.querySelector('#addProductForm button[type="submit"]').textContent = "Upload Product";`;

const replaceStr2 = `            document.querySelector('#addProductModal h3').textContent = "Add New Product";
            submitBtn.textContent = "Upload Product";
            submitBtn.disabled = false;`;

const searchStr3 = `          } else {
            alert(result.message || "Failed to save product");
          }
        } catch (err) {
          console.error("Critical Upload Error:", err);
          alert("Network error: " + err.message + ". Please check if your image is too large or the server is down.");
        }`;

const replaceStr3 = `          } else {
            alert(result.message || "Failed to save product");
            submitBtn.textContent = originalBtnText;
            submitBtn.disabled = false;
          }
        } catch (err) {
          console.error("Critical Upload Error:", err);
          alert("Network error: " + err.message + ". Please check if your image is too large or the server is down.");
          submitBtn.textContent = originalBtnText;
          submitBtn.disabled = false;
        }`;

function normalize(str) {
    return str.replace(/\r\n/g, '\n');
}

let newContent = normalize(content);

if (newContent.includes(normalize(searchStr1))) {
    newContent = newContent.replace(normalize(searchStr1), replaceStr1);
    console.log("Replaced block 1");
} else {
    console.log("Failed block 1");
}

if (newContent.includes(normalize(searchStr2))) {
    newContent = newContent.replace(normalize(searchStr2), replaceStr2);
    console.log("Replaced block 2");
} else {
    console.log("Failed block 2");
}

if (newContent.includes(normalize(searchStr3))) {
    newContent = newContent.replace(normalize(searchStr3), replaceStr3);
    console.log("Replaced block 3");
} else {
    console.log("Failed block 3");
}

fs.writeFileSync('public/boutiqueproducts.html', newContent, 'utf8');
console.log('Done!');
