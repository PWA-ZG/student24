let deferredPrompt;
document.addEventListener('DOMContentLoaded', function () {
    
    const fileInput = document.getElementById('fileInput');
    const chooseFileButton = document.getElementById('chooseFile');
    const uploadFileButton = document.getElementById('uploadFile');
    const cancelUploadButton = document.getElementById('cancelUpload');
    const imagesListContainer = document.getElementById('imagesListContainer');
    const installButton = document.getElementById('installButton');

    fileInput.addEventListener('change', function () {
        const selectedFiles = fileInput.files;
        displaySelectedImages(selectedFiles);
        toggleButtons(true);
    });

    chooseFileButton.addEventListener('click', function () {
        fileInput.click();
    });

    uploadFileButton.addEventListener('click', function () {
        const selectedFiles = fileInput.files;
        resetFileInput();
        displaySelectedImages(selectedFiles);
        toggleButtons(false);
        showNotification('Upload Successful', 'Your photo has been successfully uploaded!');
    });

    cancelUploadButton.addEventListener('click', function () {
        cancelLastImage();
        toggleButtons(false);
    });

    function displaySelectedImages(files) {
        console.log('imagesListContainer:', imagesListContainer);

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const imgElement = document.createElement('img');
            imgElement.src = URL.createObjectURL(file);
            imgElement.alt = 'Uploaded Image';
            imgElement.style.width = '250px'; 
            imgElement.style.height = '250px'; 

            const imageContainer = document.createElement('div');
            imageContainer.classList.add('image-container');
            imageContainer.appendChild(imgElement);

            imagesListContainer.appendChild(imageContainer);

            // Raspored slika u retcima
            if ((i + 1) % 4 === 0) {
                const clearRow = document.createElement('div');
                clearRow.classList.add('image-container');
                imagesListContainer.appendChild(clearRow);
            }
            // showNotification('Image uploaded successfully!')
        }
    }

    function resetFileInput() {
        fileInput.value = '';

        const lastImageContainer = imagesListContainer.lastElementChild;
        if (lastImageContainer && !uploadFileButton.style.display) {
            lastImageContainer.remove();
        }

        chooseFileButton.blur();
    }

    function cancelLastImage() {
        const lastImageContainer = imagesListContainer.lastElementChild;

        if (lastImageContainer) {
            lastImageContainer.remove();
        }

        toggleButtons(imagesListContainer.children.length > 0);
    }

    function toggleButtons(uploadMode) {
        chooseFileButton.style.display = uploadMode ? 'none' : 'inline-block';
        uploadFileButton.style.display = uploadMode ? 'inline-block' : 'none';
        cancelUploadButton.style.display = uploadMode ? 'inline-block' : 'none';
    }

    // Installing
    
    if ('serviceWorker' in navigator) {
       
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('Service Worker registered with scope:', registration.scope);
            })
            .catch(error => {
                console.error('Service Worker registration failed:', error);
            });

        
        window.addEventListener('beforeinstallprompt', (event) => {
            
            event.preventDefault();
            
            deferredPrompt = event;
            
            if (installButton) {
                installButton.style.display = 'block';
                installButton.addEventListener('click', () => {
                    
                    deferredPrompt.prompt();
                    
                    deferredPrompt.userChoice.then((choiceResult) => {
                        if (choiceResult.outcome === 'accepted') {
                            console.log('User accepted the install prompt');
                        } else {
                            console.log('User dismissed the install prompt');
                        }
                       
                        deferredPrompt = null;
                        
                        if (installButton) {
                            installButton.style.display = 'none';
                        }
                    });
                });
            }
        });
    }
});
