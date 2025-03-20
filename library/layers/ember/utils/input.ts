import { type InputType } from "@@/layers/ember/types/input";

import EText from './../components/input.vue';
import ENumberInput from './../components/numberInput.vue';
import EButton from './../components/button.vue';


export function getComponent(input: InputType) {
    switch (input) {
        case 'text':
            return EText;
        case 'number':
            return ENumberInput;
        case 'email':
            return EText;
        case 'password':
            return EText;
        case 'button':
            return EButton;
        case 'checkbox':
            return EText;
        default:
            return EText;
    }
}