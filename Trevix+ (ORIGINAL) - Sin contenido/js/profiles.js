// =========================
// TREVIX+ — PERFILES
// =========================

const ACTIVE_ACCOUNT_KEY = "trevix_active_account";
const ACTIVE_PROFILE_KEY = "trevix_active_profile";
const MAX_PROFILES = 5;

const PROFILE_AVATARS = [
    "🦊",
    "🐼",
    "🐱",
    "🐸",
    "🐯",
    "🐨",
    "🐰",
    "🐵",
    "🦄",
    "🐲",
    "🚀",
    "👾",
    "🎮",
    "🎧",
    "⭐"
];


// =========================
// ELEMENTOS
// =========================

const profileScreen =
    document.getElementById("profileScreen");

const profilesGrid =
    document.getElementById("profilesGrid");

const addProfileButton =
    document.getElementById("addProfileButton");

const profileContextMenu = document.getElementById("profileContextMenu");
const editProfileOption = document.getElementById("editProfileOption");
const deleteProfileOption = document.getElementById("deleteProfileOption");
const pinProfileOption = document.getElementById("pinProfileOption");


// PIN

const profilePinModal =
    document.getElementById("profilePinModal");

const pinProfileAvatar =
    document.getElementById("pinProfileAvatar");

const pinProfileName =
    document.getElementById("pinProfileName");

const profilePinInput =
    document.getElementById("profilePinInput");

const pinError =
    document.getElementById("pinError");

const confirmPinButton =
    document.getElementById("confirmPinButton");

const closePinButton =
    document.getElementById("closePinButton");


// CREAR PERFIL

const profileCreateModal =
    document.getElementById("profileCreateModal");

const profilePreview =
    document.getElementById("profilePreview");

const avatarOptions =
    document.getElementById("avatarOptions");

const profileNameInput =
    document.getElementById("profileNameInput");

const enablePinCheckbox =
    document.getElementById("enablePinCheckbox");

const pinCreationFields =
    document.getElementById("pinCreationFields");

const newProfilePin =
    document.getElementById("newProfilePin");

const confirmProfilePin =
    document.getElementById("confirmProfilePin");

const profileFormError =
    document.getElementById("profileFormError");

const createProfileButton =
    document.getElementById("createProfileButton");

const closeCreateProfileButton =
    document.getElementById(
        "closeCreateProfileButton"
    );

// BORRAR PERFIL

const profileDeleteModal =
    document.getElementById("profileDeleteModal");

const deleteProfileTitle =
    document.getElementById("deleteProfileTitle");

const cancelDeleteProfileButton =
    document.getElementById(
        "cancelDeleteProfileButton"
    );

const confirmDeleteProfileButton =
    document.getElementById(
        "confirmDeleteProfileButton"
    );

// EDITAR PERFIL

const profileEditModal =
    document.getElementById("profileEditModal");

const editProfilePreview =
    document.getElementById("editProfilePreview");

const editAvatarOptions =
    document.getElementById("editAvatarOptions");

const editProfileNameInput =
    document.getElementById("editProfileNameInput");

const editProfileFormError =
    document.getElementById("editProfileFormError");

const saveEditProfileButton =
    document.getElementById("saveEditProfileButton");

const closeEditProfileButton =
    document.getElementById("closeEditProfileButton");


// =========================
// GESTIONAR PIN
// =========================

const profilePinManageModal =
    document.getElementById(
        "profilePinManageModal"
    );

const pinManageIcon =
    document.getElementById(
        "pinManageIcon"
    );

const pinManageTitle =
    document.getElementById(
        "pinManageTitle"
    );

const pinManageDescription =
    document.getElementById(
        "pinManageDescription"
    );

const currentPinField =
    document.getElementById(
        "currentPinField"
    );

const currentProfilePin =
    document.getElementById(
        "currentProfilePin"
    );

const newPinField =
    document.getElementById(
        "newPinField"
    );

const manageNewProfilePin =
    document.getElementById(
        "manageNewProfilePin"
    );

const confirmPinField =
    document.getElementById(
        "confirmPinField"
    );

const manageConfirmProfilePin =
    document.getElementById(
        "manageConfirmProfilePin"
    );

const pinManageError =
    document.getElementById(
        "pinManageError"
    );

const closePinManageButton =
    document.getElementById(
        "closePinManageButton"
    );

const savePinManageButton =
    document.getElementById(
        "savePinManageButton"
    );

const removeProfilePinButton =
    document.getElementById(
        "removeProfilePinButton"
    );

// CONFIRMAR QUITAR PIN

const profileRemovePinConfirmModal =
    document.getElementById(
        "profileRemovePinConfirmModal"
    );

const removePinConfirmTitle =
    document.getElementById(
        "removePinConfirmTitle"
    );

const removePinConfirmDescription =
    document.getElementById(
        "removePinConfirmDescription"
    );

const cancelRemovePinButton =
    document.getElementById(
        "cancelRemovePinButton"
    );

const confirmRemovePinButton =
    document.getElementById(
        "confirmRemovePinButton"
    );

// =========================
// BORRAR PERFIL
// =========================

function openDeleteProfile(profile) {

    deletingProfile = profile;

    deleteProfileTitle.textContent =
        `Borrar perfil "${profile.name}"`;

    profileDeleteModal.hidden = false;

    requestAnimationFrame(() => {

        profileDeleteModal.classList.add(
            "is-visible"
        );

    });

}


function closeDeleteProfile() {

    profileDeleteModal.classList.remove(
        "is-visible"
    );

    setTimeout(() => {

        profileDeleteModal.hidden = true;

        deletingProfile = null;

    }, 250);

}


function deleteSelectedProfile() {

    if (!deletingProfile) {
        return;
    }


    const profileId =
        deletingProfile.id;


    profiles =
        profiles.filter(
            (profile) =>
                profile.id !== profileId
        );


    saveProfiles();

    renderProfiles();

    closeDeleteProfile();

}

// =========================
// GESTIONAR PIN
// =========================

function openPinManager(profile) {

    managingPinProfile = profile;

    pinManageError.hidden = true;
    pinManageError.textContent = "";

    currentProfilePin.value = "";
    manageNewProfilePin.value = "";
    manageConfirmProfilePin.value = "";


    if (profile.pin) {

        // PERFIL CON PIN

        pinManageIcon.textContent =
            "lock";

        pinManageTitle.textContent =
            `PIN de "${profile.name}"`;

        pinManageDescription.textContent =
            "Ingresá el PIN actual para cambiarlo o quitarlo.";

        currentPinField.hidden = false;

        newPinField.hidden = false;
        confirmPinField.hidden = false;

        removeProfilePinButton.hidden = false;

        savePinManageButton.textContent =
            "Cambiar PIN";

    } else {

        // PERFIL SIN PIN

        pinManageIcon.textContent =
            "lock";

        pinManageTitle.textContent =
            `Agregar PIN a "${profile.name}"`;

        pinManageDescription.textContent =
            "Elegí un PIN de 4 dígitos para proteger este perfil.";

        currentPinField.hidden = true;

        newPinField.hidden = false;
        confirmPinField.hidden = false;

        removeProfilePinButton.hidden = true;

        savePinManageButton.textContent =
            "Guardar PIN";
    }


    profilePinManageModal.hidden = false;

    requestAnimationFrame(() => {

        profilePinManageModal.classList.add(
            "is-visible"
        );

        if (profile.pin) {
            currentProfilePin.focus();
        } else {
            manageNewProfilePin.focus();
        }

    });
}


function closePinManager() {

    profilePinManageModal.classList.remove(
        "is-visible"
    );

    setTimeout(() => {

        profilePinManageModal.hidden = true;

        managingPinProfile = null;

        currentProfilePin.value = "";
        manageNewProfilePin.value = "";
        manageConfirmProfilePin.value = "";

        pinManageError.hidden = true;

    }, 250);
}


function showPinManageError(message) {

    pinManageError.textContent =
        message;

    pinManageError.hidden = false;
}

// =========================
// GUARDAR / CAMBIAR PIN
// =========================

function saveManagedPin() {

    if (!managingPinProfile) {
        return;
    }


    const profile =
        managingPinProfile;


    // Si ya existe PIN,
    // primero verificamos el actual.

    if (profile.pin) {

        const currentPin =
            currentProfilePin.value.trim();


        if (
            !/^\d{4}$/.test(currentPin)
        ) {

            showPinManageError(
                "Ingresá el PIN actual de 4 dígitos."
            );

            currentProfilePin.focus();

            return;

        }


        if (
            currentPin !== profile.pin
        ) {

            showPinManageError(
                "El PIN actual es incorrecto."
            );

            currentProfilePin.select();

            return;

        }

    }


    const newPin =
        manageNewProfilePin.value.trim();

    const confirmPin =
        manageConfirmProfilePin.value.trim();


    if (!/^\d{4}$/.test(newPin)) {

        showPinManageError(
            "El PIN debe tener exactamente 4 dígitos."
        );

        manageNewProfilePin.focus();

        return;

    }


    if (newPin !== confirmPin) {

        showPinManageError(
            "Los PIN no coinciden."
        );

        manageConfirmProfilePin.focus();

        return;

    }


    profile.pin =
        newPin;


    saveProfiles();

    renderProfiles();

    closePinManager();

}


// =========================
// ABRIR CONFIRMACIÓN QUITAR PIN
// =========================

function removeManagedPin() {

    if (!managingPinProfile) {
        return;
    }


    const profile =
        managingPinProfile;


    if (!profile.pin) {
        return;
    }


    const currentPin =
        currentProfilePin.value.trim();


    if (!/^\d{4}$/.test(currentPin)) {

        showPinManageError(
            "Ingresá el PIN actual de 4 dígitos."
        );

        currentProfilePin.focus();

        return;
    }


    if (currentPin !== profile.pin) {

        showPinManageError(
            "El PIN actual es incorrecto."
        );

        currentProfilePin.select();

        return;
    }


    removePinConfirmTitle.textContent =
        `Quitar PIN de "${profile.name}"`;

    removePinConfirmDescription.textContent =
        "El perfil dejará de estar protegido con PIN. ¿Querés continuar?";


    profileRemovePinConfirmModal.hidden =
        false;


    requestAnimationFrame(() => {

        profileRemovePinConfirmModal.classList.add(
            "is-visible"
        );

    });

}


// =========================
// CERRAR CONFIRMACIÓN
// =========================

function closeRemovePinConfirmation() {

    profileRemovePinConfirmModal.classList.remove(
        "is-visible"
    );


    setTimeout(() => {

        profileRemovePinConfirmModal.hidden =
            true;

    }, 220);

}


// =========================
// CONFIRMAR QUITAR PIN
// =========================

function confirmRemovePin() {

    if (!managingPinProfile) {
        return;
    }


    managingPinProfile.pin =
        null;


    saveProfiles();

    renderProfiles();

    closeRemovePinConfirmation();

    closePinManager();

}


// =========================
// ESTADO
// =========================

let profiles = [];
let selectedAvatar = PROFILE_AVATARS[0];
let profileWaitingTimer = null;
let selectedPinProfile = null;
let contextProfile = null;
let longPressTimer = null;
let longPressTriggered = false;
let editingProfile = null;
let selectedEditAvatar = PROFILE_AVATARS[0];
let deletingProfile = null;
let managingPinProfile = null;


// =========================
// CARGAR PERFILES
// =========================

function loadProfiles() {

    const activeAccountId =
        localStorage.getItem(
            ACTIVE_ACCOUNT_KEY
        );

        updateNavProfile();

    // No hay una cuenta iniciada.
    if (!activeAccountId) {
        profiles = [];
        return;
    }

    try {

        const storedAccounts =
            localStorage.getItem(
                "trevix_accounts"
            );

        if (!storedAccounts) {
            profiles = [];
            return;
        }

        const accounts =
            JSON.parse(storedAccounts);

        if (!Array.isArray(accounts)) {
            profiles = [];
            return;
        }

        const activeAccount =
            accounts.find(
                account =>
                    account.id ===
                    activeAccountId
            );

        if (!activeAccount) {
            profiles = [];
            return;
        }

        profiles =
            Array.isArray(
                activeAccount.profiles
            )
                ? activeAccount.profiles
                : [];

    } catch (error) {

        console.error(
            "Trevix+: error cargando perfiles.",
            error
        );

        profiles = [];
    }
}


// =========================
// GUARDAR PERFILES
// =========================

function saveProfiles() {

    const activeAccountId =
        localStorage.getItem(
            ACTIVE_ACCOUNT_KEY
        );

    if (!activeAccountId) {
        return;
    }

    try {

        const storedAccounts =
            localStorage.getItem(
                "trevix_accounts"
            );

        if (!storedAccounts) {
            return;
        }

        const accounts =
            JSON.parse(storedAccounts);

        if (!Array.isArray(accounts)) {
            return;
        }

        const activeAccount =
            accounts.find(
                account =>
                    account.id ===
                    activeAccountId
            );

        if (!activeAccount) {
            return;
        }

        activeAccount.profiles =
            profiles;

        localStorage.setItem(
            "trevix_accounts",
            JSON.stringify(accounts)
        );

    } catch (error) {

        console.error(
            "Trevix+: error guardando perfiles.",
            error
        );
    }
}


// =========================
// RENDERIZAR PERFILES
// =========================

function renderProfiles() {

    profilesGrid.replaceChildren();


    profiles.forEach((profile) => {

        const card =
            document.createElement("button");

        card.type = "button";
        card.className = "profile-card";


        const avatar =
            document.createElement("span");

        avatar.className = "profile-avatar";
        avatar.textContent = profile.avatar;


        const name =
            document.createElement("span");

        name.className = "profile-name";
        name.textContent = profile.name;


        const lock =
            document.createElement("span");

        lock.className = "profile-lock";


        if (profile.pin) {

            const lockIcon =
                document.createElement("span");

            lockIcon.className =
                "material-symbols-rounded";

            lockIcon.textContent = "lock";

            lock.appendChild(lockIcon);

        }


        card.append(
            avatar,
            name,
            lock
        );


        card.addEventListener(
            "click",
            () => selectProfile(profile)
        );


       card.addEventListener("contextmenu", (event) => {
    handleProfileContextMenu(event, profile);
});


card.addEventListener("touchstart", (event) => {
    startProfileLongPress(event, profile);
}, { passive: true });


card.addEventListener("touchend", () => {
    cancelProfileLongPress();
});


card.addEventListener("touchmove", () => {
    cancelProfileLongPress();
});     
 

        profilesGrid.appendChild(card);

    });


    // Mostrar/ocultar botón de agregar

    addProfileButton.hidden =
        profiles.length >= MAX_PROFILES;

}

function openProfileContextMenu(profile, x, y) {
  contextProfile = profile;

  profileContextMenu.hidden = false;

  // Actualizar texto del PIN según el estado actual
  const pinIcon = pinProfileOption.querySelector(".material-symbols-rounded");
  const pinText = pinProfileOption.querySelector("span:last-child");

  if (profile.pin) {
    pinIcon.textContent = "lock_reset";
    pinText.textContent = "Cambiar o quitar PIN";
  } else {
    pinIcon.textContent = "lock";
    pinText.textContent = "Agregar PIN";
  }

  // Mostrar primero para conocer sus dimensiones
  const menuWidth = profileContextMenu.offsetWidth;
  const menuHeight = profileContextMenu.offsetHeight;

  let finalX = x;
  let finalY = y;

  // Evitar que se salga por la derecha
  if (finalX + menuWidth > window.innerWidth) {
    finalX = window.innerWidth - menuWidth - 10;
  }

  // Evitar que se salga por abajo
  if (finalY + menuHeight > window.innerHeight) {
    finalY = window.innerHeight - menuHeight - 10;
  }

  // Evitar posiciones negativas
  finalX = Math.max(10, finalX);
  finalY = Math.max(10, finalY);

  profileContextMenu.style.left = `${finalX}px`;
  profileContextMenu.style.top = `${finalY}px`;
}


function closeProfileContextMenu() {
  profileContextMenu.hidden = true;
  contextProfile = null;
}


function handleProfileContextMenu(event, profile) {
  event.preventDefault();

  openProfileContextMenu(
    profile,
    event.clientX,
    event.clientY
  );
}


function startProfileLongPress(event, profile) {
  longPressTriggered = false;

  longPressTimer = setTimeout(() => {
    longPressTriggered = true;

    const touch = event.touches[0];

    openProfileContextMenu(
      profile,
      touch.clientX,
      touch.clientY
    );
  }, 600);
}


function cancelProfileLongPress() {
  clearTimeout(longPressTimer);
  longPressTimer = null;
}

document.addEventListener("click", (event) => {
  if (
    !profileContextMenu.hidden &&
    !profileContextMenu.contains(event.target)
  ) {
    closeProfileContextMenu();
  }
});


document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeProfileContextMenu();
  }
});

editProfileOption.addEventListener(
    "click",
    () => {

        if (!contextProfile) {
            return;
        }

        const profile =
            contextProfile;

        closeProfileContextMenu();

        openEditProfile(profile);

    }
);


deleteProfileOption.addEventListener(
    "click",
    () => {

        if (!contextProfile) {
            return;
        }


        const profile =
            contextProfile;


        closeProfileContextMenu();


        openDeleteProfile(profile);

    }
);


pinProfileOption.addEventListener(
    "click",
    () => {

        if (!contextProfile) {
            return;
        }

        const profile = contextProfile;

        closeProfileContextMenu();

        openPinManager(profile);
    }
);


// =========================
// SELECCIONAR PERFIL
// =========================

function selectProfile(profile) {

    clearProfileWaiting();


    if (profile.pin) {

        openPinModal(profile);

        return;

    }


    startProfileEntry(profile);

}


// =========================
// ENTRADA SIN PIN
// =========================

function startProfileEntry(profile) {

    let seconds = 3;

    profileScreen.classList.add(
        "profile-entering"
    );


    profileScreen.dataset.enteringProfile =
        profile.name;


    const originalTitle =
        document.getElementById(
            "profileTitle"
        );

    const originalText =
        originalTitle.textContent;


    originalTitle.textContent =
        `Entrando a ${profile.name}...`;


    profileWaitingTimer =
        setInterval(() => {

            seconds--;

            if (seconds <= 0) {

                clearProfileWaiting();

                enterProfile(profile);

            }

        }, 1000);


    profileScreen.dataset.originalTitle =
        originalText;

}


// =========================
// LIMPIAR ESPERA
// =========================

function clearProfileWaiting() {

    if (profileWaitingTimer) {

        clearInterval(
            profileWaitingTimer
        );

        profileWaitingTimer = null;

    }

}


// =========================
// ENTRAR AL PERFIL
// =========================

function enterProfile(profile) {

    clearProfileWaiting();


    localStorage.setItem(
        ACTIVE_PROFILE_KEY,
        profile.id
    );

    updateNavProfile();

    profileScreen.classList.add(
        "profile-screen-exit"
    );


    setTimeout(() => {

        profileScreen.hidden = true;

        profileScreen.classList.remove(
            "profile-screen-exit"
        );

    }, 450);

}


// =========================
// PIN
// =========================

function openPinModal(profile) {

    selectedPinProfile = profile;

    pinProfileAvatar.textContent =
        profile.avatar;

    pinProfileName.textContent =
        profile.name;

    profilePinInput.value = "";

    pinError.hidden = true;

    profilePinModal.hidden = false;

    requestAnimationFrame(() => {

        profilePinModal.classList.add(
            "is-visible"
        );

        profilePinInput.focus();

    });

}


function closePinModal() {

    profilePinModal.classList.remove(
        "is-visible"
    );


    setTimeout(() => {

        profilePinModal.hidden = true;

    }, 250);

}


function verifyPin() {

    if (!selectedPinProfile) {
        return;
    }


    const enteredPin =
        profilePinInput.value.trim();


    if (
        enteredPin ===
        selectedPinProfile.pin
    ) {

        const profile =
            selectedPinProfile;

        closePinModal();

        setTimeout(() => {

            enterProfile(profile);

        }, 280);

        return;

    }


    pinError.hidden = false;

    profilePinInput.value = "";

    profilePinInput.focus();

}


// =========================
// CREAR PERFIL
// =========================

function openCreateProfile() {

    if (profiles.length >= MAX_PROFILES) {
        return;
    }


    selectedAvatar =
        PROFILE_AVATARS[0];

    profilePreview.textContent =
        selectedAvatar;

    profileNameInput.value = "";

    enablePinCheckbox.checked = false;

    pinCreationFields.hidden = true;

    newProfilePin.value = "";

    confirmProfilePin.value = "";

    profileFormError.hidden = true;

    renderAvatarOptions();


    profileCreateModal.hidden = false;

    requestAnimationFrame(() => {

        profileCreateModal.classList.add(
            "is-visible"
        );

        profileNameInput.focus();

    });

}


function closeCreateProfile() {

    profileCreateModal.classList.remove(
        "is-visible"
    );


    setTimeout(() => {

        profileCreateModal.hidden = true;

    }, 250);

}


// =========================
// AVATARES
// =========================

function renderAvatarOptions() {

    avatarOptions.replaceChildren();


    PROFILE_AVATARS.forEach((avatar) => {

        const button =
            document.createElement("button");

        button.type = "button";
        button.className = "avatar-option";

        button.textContent = avatar;

        if (avatar === selectedAvatar) {

            button.classList.add(
                "selected"
            );

        }


        button.addEventListener(
            "click",
            () => {

                selectedAvatar = avatar;

                profilePreview.textContent =
                    avatar;

                renderAvatarOptions();

            }
        );


        avatarOptions.appendChild(button);

    });

}


// =========================
// VALIDAR Y CREAR
// =========================

function createProfile() {

    const name =
        profileNameInput.value.trim();


    if (!name) {

        showProfileFormError(
            "Escribí un nombre para el perfil."
        );

        profileNameInput.focus();

        return;

    }


    if (profiles.length >= MAX_PROFILES) {

        showProfileFormError(
            "Ya alcanzaste el máximo de 5 perfiles."
        );

        return;

    }


    let pin = null;


    if (enablePinCheckbox.checked) {

        const firstPin =
            newProfilePin.value.trim();

        const secondPin =
            confirmProfilePin.value.trim();


        if (
            !/^\d{4}$/.test(firstPin)
        ) {

            showProfileFormError(
                "El PIN debe tener exactamente 4 números."
            );

            newProfilePin.focus();

            return;

        }


        if (firstPin !== secondPin) {

            showProfileFormError(
                "Los PIN no coinciden."
            );

            confirmProfilePin.focus();

            return;

        }


        pin = firstPin;

    }


    const newProfile = {

        id: crypto.randomUUID(),

        name,

        avatar: selectedAvatar,

        pin

    };


    profiles.push(newProfile);

    saveProfiles();

    renderProfiles();

    closeCreateProfile();

}


// =========================
// ERROR DE FORMULARIO
// =========================

function showProfileFormError(
    message
) {

    profileFormError.textContent =
        message;

    profileFormError.hidden = false;

}

// =========================
// EDITAR PERFIL
// =========================

function openEditProfile(profile) {

    editingProfile = profile;

    selectedEditAvatar = profile.avatar;

    editProfilePreview.textContent =
        selectedEditAvatar;

    editProfileNameInput.value =
        profile.name;

    editProfileFormError.hidden = true;

    renderEditAvatarOptions();

    profileEditModal.hidden = false;

    requestAnimationFrame(() => {

        profileEditModal.classList.add(
            "is-visible"
        );

        editProfileNameInput.focus();

    });

}


function closeEditProfile() {

    profileEditModal.classList.remove(
        "is-visible"
    );

    setTimeout(() => {

        profileEditModal.hidden = true;

        editingProfile = null;

    }, 250);

}


function renderEditAvatarOptions() {

    editAvatarOptions.replaceChildren();


    PROFILE_AVATARS.forEach((avatar) => {

        const button =
            document.createElement("button");

        button.type = "button";

        button.className =
            "avatar-option";

        button.textContent =
            avatar;


        if (
            avatar === selectedEditAvatar
        ) {

            button.classList.add(
                "selected"
            );

        }


        button.addEventListener(
            "click",
            () => {

                selectedEditAvatar =
                    avatar;

                editProfilePreview.textContent =
                    avatar;

                renderEditAvatarOptions();

            }
        );


        editAvatarOptions.appendChild(
            button
        );

    });

}


function saveEditedProfile() {

    if (!editingProfile) {
        return;
    }


    const name =
        editProfileNameInput.value.trim();


    if (!name) {

        editProfileFormError.textContent =
            "Escribí un nombre para el perfil.";

        editProfileFormError.hidden =
            false;

        editProfileNameInput.focus();

        return;

    }


    editingProfile.name =
        name;

    editingProfile.avatar =
        selectedEditAvatar;


    saveProfiles();

    renderProfiles();

    closeEditProfile();

}

// =========================
// EVENTOS
// =========================

addProfileButton.addEventListener(
    "click",
    openCreateProfile
);

closePinButton.addEventListener(
    "click",
    closePinModal
);

confirmPinButton.addEventListener(
    "click",
    verifyPin
);

closeCreateProfileButton.addEventListener(
    "click",
    closeCreateProfile
);

createProfileButton.addEventListener(
    "click",
    createProfile
);

closeEditProfileButton.addEventListener(
    "click",
    closeEditProfile
);


saveEditProfileButton.addEventListener(
    "click",
    saveEditedProfile
);


closePinManageButton.addEventListener(
    "click",
    closePinManager
);

savePinManageButton.addEventListener(
    "click",
    saveManagedPin
);

removeProfilePinButton.addEventListener(
    "click",
    removeManagedPin
);

cancelRemovePinButton.addEventListener(
    "click",
    closeRemovePinConfirmation
);

confirmRemovePinButton.addEventListener(
    "click",
    confirmRemovePin
);

profilePinInput.addEventListener(
    "keydown",
    (event) => {

        if (event.key === "Enter") {

            event.preventDefault();

            verifyPin();

        }

    }
);


enablePinCheckbox.addEventListener(
    "change",
    () => {

        pinCreationFields.hidden =
            !enablePinCheckbox.checked;

        if (
            enablePinCheckbox.checked
        ) {

            newProfilePin.focus();

        }

    }
);



cancelDeleteProfileButton.addEventListener(
    "click",
    closeDeleteProfile
);


confirmDeleteProfileButton.addEventListener(
    "click",
    deleteSelectedProfile
);

// =========================
// PERFIL EN LA NAVBAR
// =========================

const navProfileButton =
    document.getElementById(
        "navProfileButton"
    );

const navProfileMenu =
    document.getElementById(
        "navProfileMenu"
    );

const navProfileAvatar =
    document.getElementById(
        "navProfileAvatar"
    );

const navProfileName =
    document.getElementById(
        "navProfileName"
    );

const navEditProfileButton =
    document.getElementById(
        "navEditProfileButton"
    );

const navChangeAccountButton =
    document.getElementById(
        "navChangeAccountButton"
    );

const navLogoutButton =
    document.getElementById(
        "navLogoutButton"
    );


// =========================
// ACTUALIZAR PERFIL ACTIVO
// =========================

function updateNavProfile() {
    const activeProfileId =
        localStorage.getItem(ACTIVE_PROFILE_KEY);

    if (!activeProfileId) return;

    const activeProfile = profiles.find(
        profile => String(profile.id) === String(activeProfileId)
    );

    if (!activeProfile) return;

    navProfileAvatar.textContent =
        activeProfile.avatar || "👤";

    navProfileName.textContent =
        activeProfile.name || "Perfil";
}


// =========================
// ABRIR / CERRAR MENÚ
// =========================

function toggleNavProfileMenu() {

    const isOpen =
        !navProfileMenu.hidden;

    navProfileMenu.hidden =
        isOpen;

    navProfileButton.setAttribute(
        "aria-expanded",
        String(!isOpen)
    );
}


function closeNavProfileMenu() {

    navProfileMenu.hidden = true;

    navProfileButton.setAttribute(
        "aria-expanded",
        "false"
    );
}


// =========================
// EDITAR PERFIL ACTIVO
// =========================

function editActiveNavProfile() {

    const activeProfileId =
        localStorage.getItem(
            ACTIVE_PROFILE_KEY
        );

    if (!activeProfileId) {
        return;
    }

    const activeProfile =
        profiles.find(
            profile =>
                profile.id ===
                activeProfileId
        );

    if (!activeProfile) {
        return;
    }

    closeNavProfileMenu();

    // Reutilizamos el mismo
    // sistema de edición existente.
    openEditProfile(
        activeProfile
    );
}

// =========================
// CAMBIAR DE CUENTA
// =========================

navChangeAccountButton.addEventListener(
    "click",
    () => {

        closeNavProfileMenu();

        if (
            typeof switchAccount ===
            "function"
        ) {
            switchAccount();
        }

    }
);


// =========================
// CERRAR SESIÓN
// =========================

navLogoutButton.addEventListener(
    "click",
    () => {

        closeNavProfileMenu();

        if (
            typeof logoutAccount ===
            "function"
        ) {
            logoutAccount();
        }

    }
);

// =========================
// ABRIR MENÚ
// =========================

navProfileButton.addEventListener(
    "click",
    event => {

        event.stopPropagation();

        toggleNavProfileMenu();

    }
);


// =========================
// EDITAR PERFIL
// =========================

navEditProfileButton.addEventListener(
    "click",
    () => {

        editActiveNavProfile();

    }
);

// =========================
// CERRAR AL HACER CLICK AFUERA
// =========================

document.addEventListener(
    "click",
    event => {

        if (
            !navProfileMenu.hidden &&
            !navProfileMenu.contains(
                event.target
            ) &&
            !navProfileButton.contains(
                event.target
            )
        ) {

            closeNavProfileMenu();

        }

    }
);


// =========================
// ESC PARA CERRAR
// =========================

document.addEventListener(
    "keydown",
    event => {

        if (event.key === "Escape") {

            closeNavProfileMenu();

        }

    }
);

// =========================
// INICIAR
// =========================

loadProfiles();

renderProfiles();

updateNavProfile();