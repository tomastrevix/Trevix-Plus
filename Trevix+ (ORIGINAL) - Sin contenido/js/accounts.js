// =========================
// TREVIX+
// SISTEMA DE CUENTAS
// =========================

const ACCOUNT_STORAGE_KEY = "trevix_accounts";
const ACCOUNT_SESSION_KEY = "trevix_active_account";

const RECOVERY_CODE_COUNT = 20;

let accounts = [];
let recoveryContext = null;
let pendingRegisteredAccount = null;


// =========================
// ELEMENTOS HTML
// =========================

const accountScreen =
    document.getElementById("accountScreen");

const accountWelcomeView =
    document.getElementById("accountWelcomeView");

const registerView =
    document.getElementById("registerView");

const loginView =
    document.getElementById("loginView");

const recoveryView =
    document.getElementById("recoveryView");

const recoveryResetView =
    document.getElementById("recoveryResetView");

const recoveryCodesView =
    document.getElementById("recoveryCodesView");


// Registro

const openRegisterButton =
    document.getElementById("openRegisterButton");

const registerUsername =
    document.getElementById("registerUsername");

const registerPassword =
    document.getElementById("registerPassword");

const registerPasswordConfirm =
    document.getElementById("registerPasswordConfirm");

const registerError =
    document.getElementById("registerError");

const registerButton =
    document.getElementById("registerButton");

const registerBackButton =
    document.getElementById("registerBackButton");


// Login

const openLoginButton =
    document.getElementById("openLoginButton");

const loginUsername =
    document.getElementById("loginUsername");

const loginPassword =
    document.getElementById("loginPassword");

const loginError =
    document.getElementById("loginError");

const loginButton =
    document.getElementById("loginButton");

const loginBackButton =
    document.getElementById("loginBackButton");


// Recuperación

const openRecoveryButton =
    document.getElementById("openRecoveryButton");

const loginRecoveryButton =
    document.getElementById("loginRecoveryButton");

const recoveryCode =
    document.getElementById("recoveryCode");

const recoveryError =
    document.getElementById("recoveryError");

const recoveryButton =
    document.getElementById("recoveryButton");

const recoveryBackButton =
    document.getElementById("recoveryBackButton");


// Restablecer contraseña

const recoveredUsername =
    document.getElementById("recoveredUsername");

const recoveryNewPassword =
    document.getElementById("recoveryNewPassword");

const recoveryNewPasswordConfirm =
    document.getElementById("recoveryNewPasswordConfirm");

const recoveryResetError =
    document.getElementById("recoveryResetError");

const resetPasswordButton =
    document.getElementById("resetPasswordButton");

const recoveryResetBackButton =
    document.getElementById("recoveryResetBackButton");


// Códigos

const recoveryCodes =
    document.getElementById("recoveryCodes");

const continueAfterRegisterButton =
    document.getElementById(
        "continueAfterRegisterButton"
    );


// =========================
// UTILIDADES
// =========================

function normalizeUsername(username) {

    return username
        .trim()
        .toLowerCase();
}


function generateId() {

    if (crypto.randomUUID) {
        return crypto.randomUUID();
    }

    return (
        Date.now().toString(36) +
        Math.random().toString(36).slice(2)
    );
}


// =========================
// HASH
// =========================

async function hashText(value) {

    const data =
        new TextEncoder().encode(value);

    const hashBuffer =
        await crypto.subtle.digest(
            "SHA-256",
            data
        );

    return Array
        .from(new Uint8Array(hashBuffer))
        .map(
            byte =>
                byte
                    .toString(16)
                    .padStart(2, "0")
        )
        .join("");
}


// =========================
// STORAGE
// =========================

function loadAccounts() {

    try {

        const stored =
            localStorage.getItem(
                ACCOUNT_STORAGE_KEY
            );

        if (!stored) {
            accounts = [];
            return;
        }

        const parsed =
            JSON.parse(stored);

        accounts =
            Array.isArray(parsed)
                ? parsed
                : [];

    } catch (error) {

        console.error(
            "Trevix+: error cargando cuentas.",
            error
        );

        accounts = [];
    }
}


function saveAccounts() {

    localStorage.setItem(
        ACCOUNT_STORAGE_KEY,
        JSON.stringify(accounts)
    );
}


// =========================
// CUENTA ACTIVA
// =========================

function getActiveAccountId() {

    return localStorage.getItem(
    ACCOUNT_SESSION_KEY
    );
}


function getActiveAccount() {

    const activeId =
        getActiveAccountId();

    if (!activeId) {
        return null;
    }

    return (
        accounts.find(
            account =>
                account.id === activeId
        ) || null
    );
}


function setActiveAccount(account) {

    localStorage.setItem(
    ACCOUNT_SESSION_KEY,
    account.id
);
}


function clearActiveAccount() {

    localStorage.removeItem(
    ACCOUNT_SESSION_KEY
);
}


// =========================
// MOSTRAR / OCULTAR CUENTA
// =========================

function showAccountScreen() {

    accountScreen.hidden = false;

    if (typeof profileScreen !== "undefined") {
        profileScreen.hidden = true;
    }
}


function hideAccountScreen() {

    accountScreen.hidden = true;
}


function showProfileScreen() {

    hideAccountScreen();

    if (typeof profileScreen !== "undefined") {
        profileScreen.hidden = false;
    }

    if (
        typeof loadProfiles === "function" &&
        typeof renderProfiles === "function"
    ) {
        loadProfiles();
        renderProfiles();
    }
}


// =========================
// VISTAS DE CUENTA
// =========================

function hideAccountViews() {

    accountWelcomeView.hidden = true;
    registerView.hidden = true;
    loginView.hidden = true;
    recoveryView.hidden = true;
    recoveryResetView.hidden = true;
    recoveryCodesView.hidden = true;
}


function showAccountView(view) {

    hideAccountViews();

    view.hidden = false;
}


function clearAccountErrors() {

    registerError.hidden = true;
    registerError.textContent = "";

    loginError.hidden = true;
    loginError.textContent = "";

    recoveryError.hidden = true;
    recoveryError.textContent = "";

    recoveryResetError.hidden = true;
    recoveryResetError.textContent = "";
}


// =========================
// REGISTRO
// =========================

function openRegister() {

    clearAccountErrors();

    registerUsername.value = "";
    registerPassword.value = "";
    registerPasswordConfirm.value = "";

    showAccountView(registerView);

    registerUsername.focus();
}


function validateRegistrationUsername(username) {

    return /^[a-zA-Z0-9_]{3,20}$/.test(
        username
    );
}


async function registerAccount() {

    clearAccountErrors();

    const username =
        normalizeUsername(
            registerUsername.value
        );

    const password =
        registerPassword.value;

    const passwordConfirm =
        registerPasswordConfirm.value;


    if (!validateRegistrationUsername(username)) {

        registerError.textContent =
            "El usuario debe tener entre 3 y 20 caracteres y solo puede usar letras, números y _.";
        
        registerError.hidden = false;

        registerUsername.focus();

        return;
    }


    if (password.length < 6) {

        registerError.textContent =
            "La contraseña debe tener al menos 6 caracteres.";

        registerError.hidden = false;

        registerPassword.focus();

        return;
    }


    if (password !== passwordConfirm) {

        registerError.textContent =
            "Las contraseñas no coinciden.";

        registerError.hidden = false;

        registerPasswordConfirm.focus();

        return;
    }


    const usernameExists =
        accounts.some(
            account =>
                normalizeUsername(
                    account.username
                ) === username
        );


    if (usernameExists) {

        registerError.textContent =
            "Ese nombre de usuario ya está registrado.";

        registerError.hidden = false;

        registerUsername.focus();

        return;
    }


    const passwordHash =
        await hashText(password);


    const recoveryCodeData =
        await generateRecoveryCodes();


    const account = {

        id: generateId(),

        username,

        passwordHash,

        recoveryCodes:
            recoveryCodeData.hashedCodes,

        profiles:
            getLegacyProfiles(),

        createdAt:
            new Date().toISOString()
    };


    // Si no había perfiles anteriores,
    // creamos los perfiles iniciales.

    if (
        !Array.isArray(account.profiles) ||
        account.profiles.length === 0
    ) {

        account.profiles = [

            {
                id: generateId(),
                name: "Principal",
                avatar: "🦊",
                pin: null
            },

            {
                id: generateId(),
                name: "Familia",
                avatar: "🐼",
                pin: null
            }

        ];
    }


    accounts.push(account);

    saveAccounts();


    // Ya no necesitamos la versión
    // antigua de perfiles globales.

    localStorage.removeItem(
        "trevix_profiles"
    );


    pendingRegisteredAccount = account;


    showRecoveryCodes(
        recoveryCodeData.plainCodes
    );
}


// =========================
// CÓDIGOS DE RECUPERACIÓN
// =========================

function generateRawRecoveryCode() {

    const characters =
        "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

    const values =
        new Uint32Array(8);

    crypto.getRandomValues(values);

    let result = "";

    for (let i = 0; i < values.length; i++) {

        result +=
            characters[
                values[i] %
                characters.length
            ];
    }

    return (
        result.slice(0, 4) +
        "-" +
        result.slice(4)
    );
}


async function generateRecoveryCodes() {

    const plainCodes = [];
    const hashedCodes = [];

    for (
        let i = 0;
        i < RECOVERY_CODE_COUNT;
        i++
    ) {

        const code =
            generateRawRecoveryCode();

        plainCodes.push(code);

        hashedCodes.push(
            await hashText(code)
        );
    }

    return {
        plainCodes,
        hashedCodes
    };
}


function showRecoveryCodes(codes) {

    recoveryCodes.innerHTML = "";

    codes.forEach(code => {

        const element =
            document.createElement("code");

        element.textContent = code;

        recoveryCodes.appendChild(
            element
        );
    });

    showAccountView(
        recoveryCodesView
    );
}


// =========================
// LOGIN
// =========================

function openLogin() {

    clearAccountErrors();

    loginUsername.value = "";
    loginPassword.value = "";

    showAccountView(loginView);

    loginUsername.focus();
}


async function loginAccount() {

    clearAccountErrors();

    const username =
        normalizeUsername(
            loginUsername.value
        );

    const password =
        loginPassword.value;


    if (!username || !password) {

        loginError.textContent =
            "Ingresá tu usuario y contraseña.";

        loginError.hidden = false;

        return;
    }


    const account =
        accounts.find(
            item =>
                normalizeUsername(
                    item.username
                ) === username
        );


    if (!account) {

        loginError.textContent =
            "El usuario o la contraseña son incorrectos.";

        loginError.hidden = false;

        return;
    }


    const passwordHash =
        await hashText(password);


    if (
        passwordHash !==
        account.passwordHash
    ) {

        loginError.textContent =
            "El usuario o la contraseña son incorrectos.";

        loginError.hidden = false;

        return;
    }


    setActiveAccount(account);

    showProfileScreen();
}


// =========================
// RECUPERACIÓN
// =========================

function openRecovery() {

    clearAccountErrors();

    recoveryCode.value = "";

    showAccountView(
        recoveryView
    );

    recoveryCode.focus();
}


async function recoverAccount() {

    clearAccountErrors();

    const normalizedCode =
        recoveryCode.value
            .trim()
            .toUpperCase();


    if (
        !/^[A-Z0-9]{4}-[A-Z0-9]{4}$/
            .test(normalizedCode)
    ) {

        recoveryError.textContent =
            "Ingresá un código con el formato XXXX-XXXX.";

        recoveryError.hidden = false;

        recoveryCode.focus();

        return;
    }


    const codeHash =
        await hashText(
            normalizedCode
        );


    let foundAccount = null;
    let foundCodeIndex = -1;


    for (
        const account of accounts
    ) {

        if (
            !Array.isArray(
                account.recoveryCodes
            )
        ) {
            continue;
        }


        const index =
            account.recoveryCodes.indexOf(
                codeHash
            );


        if (index !== -1) {

            foundAccount = account;
            foundCodeIndex = index;

            break;
        }
    }


    if (
        !foundAccount ||
        foundCodeIndex === -1
    ) {

        recoveryError.textContent =
            "El código no es válido o ya fue utilizado.";

        recoveryError.hidden = false;

        recoveryCode.select();

        return;
    }


    recoveryContext = {

        accountId:
            foundAccount.id,

        codeIndex:
            foundCodeIndex
    };


    recoveredUsername.textContent =
        foundAccount.username;


    recoveryNewPassword.value = "";
    recoveryNewPasswordConfirm.value = "";


    showAccountView(
        recoveryResetView
    );

    recoveryNewPassword.focus();
}


// =========================
// RESTABLECER CONTRASEÑA
// =========================

async function resetRecoveredPassword() {

    recoveryResetError.hidden = true;
    recoveryResetError.textContent = "";


    if (!recoveryContext) {

        recoveryResetError.textContent =
            "La recuperación expiró. Volvé a ingresar el código.";

        recoveryResetError.hidden = false;

        return;
    }


    const newPassword =
        recoveryNewPassword.value;

    const confirmPassword =
        recoveryNewPasswordConfirm.value;


    if (newPassword.length < 6) {

        recoveryResetError.textContent =
            "La contraseña debe tener al menos 6 caracteres.";

        recoveryResetError.hidden = false;

        recoveryNewPassword.focus();

        return;
    }


    if (
        newPassword !==
        confirmPassword
    ) {

        recoveryResetError.textContent =
            "Las contraseñas no coinciden.";

        recoveryResetError.hidden = false;

        recoveryNewPasswordConfirm.focus();

        return;
    }


    const account =
        accounts.find(
            item =>
                item.id ===
                recoveryContext.accountId
        );


    if (!account) {

        recoveryResetError.textContent =
            "No se encontró la cuenta.";

        recoveryResetError.hidden = false;

        return;
    }


    account.passwordHash =
        await hashText(
            newPassword
        );


    // El código se consume
    // únicamente después de cambiar
    // correctamente la contraseña.

    account.recoveryCodes.splice(
        recoveryContext.codeIndex,
        1
    );


    saveAccounts();


    recoveryContext = null;


    loginUsername.value =
        account.username;

    loginPassword.value = "";


    showAccountView(
        loginView
    );


    loginError.hidden = false;

    loginError.textContent =
        "Contraseña actualizada. Ya podés iniciar sesión.";
}


// =========================
// CONTINUAR DESPUÉS
// DEL REGISTRO
// =========================

function continueAfterRegistration() {

    if (!pendingRegisteredAccount) {
        return;
    }


    const account =
        pendingRegisteredAccount;


    setActiveAccount(account);


    pendingRegisteredAccount = null;


    showProfileScreen();
}


// =========================
// PROFILES LEGACY
// =========================

function getLegacyProfiles() {

    try {

        const stored =
            localStorage.getItem(
                "trevix_profiles"
            );

        if (!stored) {
            return [];
        }


        const parsed =
            JSON.parse(stored);


        if (
            !Array.isArray(parsed)
        ) {
            return [];
        }


        return parsed;

    } catch (error) {

        console.warn(
            "Trevix+: no se pudieron migrar los perfiles anteriores.",
            error
        );

        return [];
    }
}


// =========================
// CAMBIAR DE CUENTA
// =========================

function switchAccount() {
    localStorage.removeItem("trevix_active_profile");

    if (typeof showProfileScreen === "function") {
        showProfileScreen();
    }
}

// =========================
// CERRAR SESIÓN
// =========================

function logoutAccount() {

    // Eliminamos el perfil activo
    localStorage.removeItem(
        "trevix_active_profile"
    );

    // Eliminamos la cuenta activa
    clearActiveAccount();

    // Mostramos la pantalla de cuenta
    showAccountScreen();

    // Volvemos a la pantalla inicial
    showAccountView(
        accountWelcomeView
    );

    clearAccountErrors();
}


// =========================
// INICIALIZACIÓN
// =========================

function initializeAccounts() {

    loadAccounts();


    const activeAccount =
        getActiveAccount();


    if (activeAccount) {

        showProfileScreen();

    } else {

        showAccountScreen();

        showAccountView(
            accountWelcomeView
        );
    }
}


// =========================
// EVENTOS
// =========================

openRegisterButton.addEventListener(
    "click",
    openRegister
);


openLoginButton.addEventListener(
    "click",
    openLogin
);


openRecoveryButton.addEventListener(
    "click",
    openRecovery
);


loginRecoveryButton.addEventListener(
    "click",
    openRecovery
);


registerButton.addEventListener(
    "click",
    registerAccount
);


registerBackButton.addEventListener(
    "click",
    () => {

        clearAccountErrors();

        showAccountView(
            accountWelcomeView
        );
    }
);


loginButton.addEventListener(
    "click",
    loginAccount
);


loginBackButton.addEventListener(
    "click",
    () => {

        clearAccountErrors();

        showAccountView(
            accountWelcomeView
        );
    }
);


recoveryButton.addEventListener(
    "click",
    recoverAccount
);


recoveryBackButton.addEventListener(
    "click",
    () => {

        clearAccountErrors();

        showAccountView(
            accountWelcomeView
        );
    }
);


resetPasswordButton.addEventListener(
    "click",
    resetRecoveredPassword
);


recoveryResetBackButton.addEventListener(
    "click",
    () => {

        recoveryContext = null;

        clearAccountErrors();

        showAccountView(
            recoveryView
        );

        recoveryCode.focus();
    }
);


continueAfterRegisterButton.addEventListener(
    "click",
    continueAfterRegistration
);


// ENTER

registerPasswordConfirm.addEventListener(
    "keydown",
    event => {

        if (event.key === "Enter") {

            event.preventDefault();

            registerAccount();
        }
    }
);


loginPassword.addEventListener(
    "keydown",
    event => {

        if (event.key === "Enter") {

            event.preventDefault();

            loginAccount();
        }
    }
);


recoveryCode.addEventListener(
    "keydown",
    event => {

        if (event.key === "Enter") {

            event.preventDefault();

            recoverAccount();
        }
    }
);


recoveryNewPasswordConfirm.addEventListener(
    "keydown",
    event => {

        if (event.key === "Enter") {

            event.preventDefault();

            resetRecoveredPassword();
        }
    }
);


// =========================
// ARRANCAR
// =========================

initializeAccounts();