export function setModalType(type) {
    return {
        type: 'SET_MODAL_TYPE',
        payload: type
    }
}

export function toggleModalActive(override = null, bool) {
    if (override === 'override') {
        return {
            type: 'TOGGLE_MODAL_ACTIVE',
            payload: bool
        }
    }
    else {
        return {
            type: 'TOGGLE_MODAL_ACTIVE',
            payload: null
        }
    }
}