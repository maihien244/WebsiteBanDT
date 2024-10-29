function encode() {
    console.log('Vo roi')
    const fileInput = document.querySelector('#upload_file').files
    if(fileInput.length > 0) {
        const imgSelected = fileInput[0]
        const reader = new FileReader()

        reader.onload = function(fileLoaderEvent) {
            document.querySelector('.user-avatar img').src = `${fileLoaderEvent.target.result}`
            document.querySelector('#base64-string').value = fileLoaderEvent.target.result
            // console.log(fileLoaderEvent.target.result)
        }

        reader.onerror = function() {
            document.querySelector('.error_msg').innerText = 'Upload Image Fail!'
        }

        reader.readAsDataURL(imgSelected)
    }
}