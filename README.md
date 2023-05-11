# LeftField.ai

Add ChatGPT to any <form> field with a few lines of code.


## Usage Examples

With React:

```javascript
import { lfaiCreatePopup } from 'leftfieldai';

function MyForm() {
    // ...

    return (
        <form>
            <input id="title" type="text" />
            <a onClick={() => lfaiCreatePopup({ elementId: 'title', pubKey: 'lfai_xxxx' })}>Use AI for title suggestions</a>
        </form>
    );
}
```

With Other JavaScript:

```javascript
// Assuming the following HTML is in the DOM:
// <input id="title" type="text" /> <a href="#" id="titleAILink">Use AI for title suggestions</a>

// Javascript to add:
import { lfaiCreatePopup } from 'leftfieldai';

document.getElementById('titleAILink').addEventListener('click', () => lfaiCreatePopup({ elementId: 'title', pubKey: 'lfai_xxxx' }));
```

## All Options

The package exports a type that has all the available options:

```
export type TLeftFieldPopupOptions = {
  pubKey: string; // Public key from your LeftFieldAI account
  elementId: string; // ID of the input field you want to fill in with the ChatGPT response
  prompt?: {
    default?: string; // Default ChatGPT prompt to pre-fill for the user
    placeholder?: string; // Placeholder text in the ChatGPT field
    suggested?: string[]; // Suggested starting prompts that your user can click on to get started without typing
  };
  popup?: {
    title?: string; // Title displayed to the user in the popup window UI
  };
};
```
