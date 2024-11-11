function getParent(selector) {
    return selector.parentElement
}

function Validate(option) {
    const inputSeletor = document.querySelector(option.inputSelector)
    const message_error = getParent(inputSeletor).querySelector(option.message_error)
    const regex = new RegExp(inputSeletor.getAttribute('pattern'))
    const reg = /[^0-9]/
    inputSeletor.onblur = () => {
        let isMatch = true
        const value = parseInt(inputSeletor.value)
        if(inputSeletor.value != '') {
            isMatch = !reg.test(inputSeletor.value) && regex.test(value)
        }
        if(!isMatch) {
            message_error.innerText = option?.message || 'This field is invalid'
            inputSeletor.classList.add('invalid')
            message_error.classList.add('invalid')
        } else {
            message_error.innerText = ''
            inputSeletor.classList.remove('invalid')
            message_error.classList.remove('invalid')
        }
    }
}