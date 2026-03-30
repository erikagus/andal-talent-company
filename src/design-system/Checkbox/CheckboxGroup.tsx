import { Checkbox } from './Checkbox';
import './CheckboxGroup.css';

export interface CheckboxGroupItem {
  id: string;
  label: React.ReactNode;
  checked?: boolean;
  disabled?: boolean;
  error?: boolean;
}

export interface CheckboxGroupProps {
  /** Label for the "Select all" parent checkbox. Defaults to "Select all". */
  label?: React.ReactNode;
  items: CheckboxGroupItem[];
  /**
   * Called on any change — receives the full updated items array.
   * Disabled items are passed through unchanged.
   */
  onChange?: (items: CheckboxGroupItem[]) => void;
  /** Disables only the parent checkbox. Each item controls its own disabled state. */
  disabled?: boolean;
}

export function CheckboxGroup({
  label = 'Select all',
  items,
  onChange,
  disabled,
}: CheckboxGroupProps) {
  // Parent state is derived from enabled items only — disabled children
  // are excluded so they never influence the select-all affordance.
  const enabledItems = items.filter((item) => !item.disabled);
  const checkedEnabled = enabledItems.filter((item) => item.checked);
  const allChecked = enabledItems.length > 0 && checkedEnabled.length === enabledItems.length;
  const someChecked = checkedEnabled.length > 0 && !allChecked;

  function handleParentChange(e: React.ChangeEvent<HTMLInputElement>) {
    onChange?.(
      items.map((item) =>
        item.disabled ? item : { ...item, checked: e.target.checked }
      )
    );
  }

  function handleItemChange(id: string, checked: boolean) {
    onChange?.(items.map((item) => (item.id === id ? { ...item, checked } : item)));
  }

  return (
    <div className="checkbox-group">
      <Checkbox
        label={label}
        checked={allChecked}
        indeterminate={someChecked}
        disabled={disabled}
        onChange={handleParentChange}
      />
      <div className="checkbox-group__children">
        {items.map((item) => (
          <Checkbox
            key={item.id}
            label={item.label}
            checked={item.checked ?? false}
            disabled={item.disabled}
            error={item.error}
            onChange={(e) => handleItemChange(item.id, e.target.checked)}
          />
        ))}
      </div>
    </div>
  );
}
