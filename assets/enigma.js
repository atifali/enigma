$(document).ready(function(){

    $(function () {
        $('[data-toggle="tooltip"]').tooltip({
            animated: 'fade',
            placement: 'top',
            trigger: 'click'
        });
    });

    $("button").click(function(){
        if (this.id == "nav-btn") {
            $("button").removeClass("btn-primary");
            $("button").addClass("btn-secondary");
            $(this).removeClass("btn-secondary");
            $(this).addClass("btn-primary");
        }

        if (this.id == "copy-btn") {
            if (this.value == "private") {
                $("#private-key-text").prop("disabled", false);
                $("#private-key-text").select();
                document.execCommand('copy');
                $("#private-key-text").prop("disabled", true);
            } else if (this.value == "public") {
                $("#public-key-text").prop("disabled", false);
                $("#public-key-text").select();
                document.execCommand('copy');
                $("#public-key-text").prop("disabled", true);
            } else if (this.value == "encrypted") {
                $("#encrypted-message-text").prop("disabled", false);
                $("#encrypted-message-text").select();
                document.execCommand('copy');
                $("#encrypted-message-text").prop("disabled", true);
            } else if (this.value == "decrypted") {
                $("#decrypted-message-text").prop("disabled", false);
                $("#decrypted-message-text").select();
                document.execCommand('copy');
                $("#decrypted-message-text").prop("disabled", true);
            }

            if (window.getSelection) {
                if (window.getSelection().empty) {  // Chrome
                  window.getSelection().empty();
                } else if (window.getSelection().removeAllRanges) {  // Firefox
                  window.getSelection().removeAllRanges();
                }
            } else if (document.selection) {  // IE?
                document.selection.empty();
            }

            setTimeout(() => {
                $(this).tooltip('hide');
            }, 1000);
        }

        if (this.id == "generate-btn") {
            var loading = document.getElementById("loading");
            var copyActions = document.getElementById("copy-keys-action");
            var privateKey = document.getElementById("private-key");
            var privateKeyText = document.getElementById("private-key-text");
            var publicKey = document.getElementById("public-key");
            var publicKeyText = document.getElementById("public-key-text");
            var keySizeSelector = document.getElementById("inputSizeSelect");
            var keySize = keySizeSelector.options[keySizeSelector.selectedIndex].value
            var alertMessage = document.getElementById("alert-message");
            alertMessage.innerHTML = ``;
            copyActions.style.visibility = "hidden";
            privateKey.style.visibility = "hidden";
            publicKey.style.visibility = "hidden";
            $(this).prop('disabled', true);

            if (keySize != 0) {
                var crypt = new JSEncrypt({default_key_size: keySize});
                loading.style.display = "inline";
                crypt.getKey(() => {
                    loading.style.display = "none";
                    copyActions.style.visibility = "visible";
                    privateKey.style.visibility = "visible";
                    publicKey.style.visibility = "visible";
                    privateKeyText.style.height = "";
                    privateKeyText.value = crypt.getPrivateKey();
                    privateKeyText.style.height = privateKeyText.scrollHeight + "px";
                    publicKeyText.style.height = "";
                    publicKeyText.value = crypt.getPublicKey();
                    publicKeyText.style.height = publicKeyText.scrollHeight + "px";
                    $(this).prop('disabled', false);
                });
            } else {
                alertMessage.innerHTML = `
                <div class="alert alert-danger" role="alert" id="key-size-error" style="width: 65%; margin-left: 17%;">
                    <strong>ERROR: Please select your desired key size above before a key pair can be generated!</strong>
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                `;
                $(this).prop('disabled', false);
            }
        }

        if (this.id == "encrypt-btn") {
            var loadingEncrypt = document.getElementById("loading-encrypt");
            var copyEncryptedActions = document.getElementById("copy-encrypted-action");
            var publicKeyEncryptText = document.getElementById("public-key-encrypt-text");
            var messageEncryptText = document.getElementById("message-encrypt-text");
            var encryptedResult = document.getElementById("encrypted-result");
            var encryptedMessageText = document.getElementById("encrypted-message-text");
            var alertMessageEncrypt = document.getElementById("alert-message-encrypt");
            alertMessageEncrypt.innerHTML = ``;
            copyEncryptedActions.style.display = "none";
            encryptedResult.style.display = "none";
            $(this).prop('disabled', true);

            if (publicKeyEncryptText.value != "" && messageEncryptText.value != "") {
                var crypt = new JSEncrypt();
                loadingEncrypt.style.display = "inline";
                setTimeout(() => {
                    crypt.setPublicKey(publicKeyEncryptText.value);
                    var messageToEncrypt = messageEncryptText.value;
                    var encryptedText = crypt.encrypt(messageToEncrypt);
                    loadingEncrypt.style.display = "none";
                    copyEncryptedActions.style.display = "inline";
                    encryptedResult.style.display = "flex";
                    encryptedMessageText.style.height = "";
                    encryptedMessageText.value = encryptedText;
                    encryptedMessageText.style.height = encryptedMessageText.scrollHeight + "px";
                    $(this).prop('disabled', false);
                },3000);
            } else {
                if (publicKeyEncryptText.value == "" && messageEncryptText.value == "") {
                    alertMessageEncrypt.innerHTML = `
                    <div class="alert alert-danger" role="alert" id="decrypt-input-error" style="width: 70%; margin-left: 15%;">
                        <strong>ERROR: Please make sure to input a RSA public key and the message to be encrypted above!</strong>
                        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    `;
                } else if (publicKeyEncryptText.value == "") {
                    alertMessageEncrypt.innerHTML = `
                    <div class="alert alert-danger" role="alert" id="decrypt-input-error" style="width: 65%; margin-left: 17%;">
                        <strong>ERROR: Please make sure to input a RSA public key above!</strong>
                        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    `;
                } else {
                    alertMessageEncrypt.innerHTML = `
                    <div class="alert alert-danger" role="alert" id="decrypt-input-error" style="width: 65%; margin-left: 17%;">
                        <strong>ERROR: Please make sure to input the message to be encrypted above!</strong>
                        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    `;
                }
                $(this).prop('disabled', false);
            }
        }

        if (this.id == "decrypt-btn") {
            var loadingDecrypt = document.getElementById("loading-decrypt");
            var copyDecryptedActions = document.getElementById("copy-decrypted-action");
            var privateKeyDecryptText = document.getElementById("private-key-decrypt-text");
            var messageDecryptText = document.getElementById("message-decrypt-text");
            var decryptedResult = document.getElementById("decrypted-result");
            var decryptedMessageText = document.getElementById("decrypted-message-text");
            var alertMessageDecrypt = document.getElementById("alert-message-decrypt");
            alertMessageDecrypt.innerHTML = ``;
            copyDecryptedActions.style.display = "none";
            decryptedResult.style.display = "none";
            $(this).prop('disabled', true);

            if (privateKeyDecryptText.value != "" && messageDecryptText.value != "") {
                var crypt = new JSEncrypt();
                loadingDecrypt.style.display = "inline";

                setTimeout(() => {
                    crypt.setPrivateKey(privateKeyDecryptText.value);
                    var messageToDecrypt = messageDecryptText.value;
                    var decryptedText = crypt.decrypt(messageToDecrypt);
                    loadingDecrypt.style.display = "none";
                    copyDecryptedActions.style.display = "inline";
                    decryptedResult.style.display = "flex";
                    decryptedMessageText.style.height = "";
                    decryptedMessageText.value = decryptedText;
                    decryptedMessageText.style.height = decryptedMessageText.scrollHeight + "px";
                    $(this).prop('disabled', false);
                },3000);
            } else {
                if (privateKeyDecryptText.value == "" && messageDecryptText.value == "") {
                    alertMessageDecrypt.innerHTML = `
                    <div class="alert alert-danger" role="alert" id="decrypt-input-error" style="width: 70%; margin-left: 15%;">
                        <strong>ERROR: Please make sure to input a RSA private key and the message to be decrypted above!</strong>
                        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    `;
                } else if (privateKeyDecryptText.value == "") {
                    alertMessageDecrypt.innerHTML = `
                    <div class="alert alert-danger" role="alert" id="decrypt-input-error" style="width: 65%; margin-left: 17%;">
                        <strong>ERROR: Please make sure to input a RSA private key above!</strong>
                        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    `;
                } else {
                    alertMessageDecrypt.innerHTML = `
                    <div class="alert alert-danger" role="alert" id="decrypt-input-error" style="width: 65%; margin-left: 17%;">
                        <strong>ERROR: Please make sure to input the message to be decrypted above!</strong>
                        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    `;
                }
                $(this).prop('disabled', false);
            }
        }
    });

});