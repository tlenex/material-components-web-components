/**
@license
Copyright 2019 Google Inc. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
import {FormElement, HTMLElementWithRipple} from '@material/mwc-base/form-element.js';
import {rippleNode} from '@material/mwc-ripple/ripple-directive.js';
import {html, property, PropertyValues, query} from 'lit-element';
import {classMap} from 'lit-html/directives/class-map.js';
import {ifDefined} from 'lit-html/directives/if-defined.js';

/** @soyCompatible */
export class CheckboxBase extends FormElement {
  @query('.mdc-checkbox') protected mdcRoot!: HTMLElementWithRipple;

  @query('input') protected formElement!: HTMLInputElement;

  @property({type: Boolean, reflect: true}) checked = false;

  @property({type: Boolean}) indeterminate = false;

  @property({type: Boolean, reflect: true}) disabled = false;

  @property({type: String}) value = '';

  @property({type: String}) name = '';

  // use @internalProperty() when published
  @property({attribute: false}) protected animationClass = '';

  // MDC Foundation is not used
  protected createAdapter() {
    return {};
  }

  protected mdcFoundation = undefined;

  protected mdcFoundationClass = undefined;

  get ripple() {
    return this.mdcRoot.ripple;
  }

  protected update(changedProperties: PropertyValues) {
    const oldIndeterminate = changedProperties.get('indeterminate');
    const oldChecked = changedProperties.get('checked');
    if (oldIndeterminate !== undefined || oldChecked !== undefined) {
      const oldState =
          this.calculateAnimationStateName(!!oldChecked, !!oldIndeterminate);
      const newState =
          this.calculateAnimationStateName(this.checked, this.indeterminate);
      this.animationClass = `${oldState}-${newState}`;
    }
    super.update(changedProperties);
  }

  protected calculateAnimationStateName(
      checked: boolean, indeterminate: boolean): string {
    if (indeterminate) {
      return 'indeterminate';
    } else if (checked) {
      return 'checked';
    } else {
      return 'unchecked';
    }
  }

  protected render() {
    /** @classMap */
    const classes = {
      'mdc-checkbox--disabled': this.disabled,
      'mdc-checkbox--selected': this.indeterminate || this.checked,
      // transition animiation classes
      'mdc-checkbox--anim-checked-indeterminate':
          this.animationClass === 'checked-indeterminate',
      'mdc-checkbox--anim-checked-unchecked':
          this.animationClass === 'checked-unchecked',
      'mdc-checkbox--anim-indeterminate-checked':
          this.animationClass === 'indeterminate-checked',
      'mdc-checkbox--anim-indeterminate-unchecked':
          this.animationClass === 'indeterminate-unchecked',
      'mdc-checkbox--anim-unchecked-checked':
          this.animationClass === 'unchecked-checked',
      'mdc-checkbox--anim-unchecked-indeterminate':
          this.animationClass === 'unchecked-indeterminate',
    };
    return html`
      <div class="mdc-checkbox mdc-checkbox--upgraded ${classMap(classes)}">
        <input type="checkbox"
              class="mdc-checkbox__native-control"
              aria-checked="${
        ifDefined(this.indeterminate ? 'mixed' : undefined)}"
              ?disabled="${this.disabled}"
              @change="${this._changeHandler}"
              .indeterminate="${this.indeterminate}"
              .checked="${this.checked}"
              .value="${this.value}">
        <div class="mdc-checkbox__background">
          <svg class="mdc-checkbox__checkmark"
              viewBox="0 0 24 24">
            <path class="mdc-checkbox__checkmark-path"
                  fill="none"
                  d="M1.73,12.91 8.1,19.28 22.79,4.59"></path>
          </svg>
          <div class="mdc-checkbox__mixedmark"></div>
        </div>
        <div class="mdc-checkbox__ripple"></div>
      </div>`;
  }

  private _changeHandler() {
    this.checked = this.formElement.checked;
    this.indeterminate = this.formElement.indeterminate;
  }

  firstUpdated() {
    super.firstUpdated();
    this.mdcRoot.ripple = rippleNode(
        {surfaceNode: this.mdcRoot, interactionNode: this.formElement});
  }
}
