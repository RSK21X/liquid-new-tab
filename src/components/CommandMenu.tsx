import { UiCopy } from '../i18n';

interface CommandMenuProps {
  copy: UiCopy;
  onSelect: (command: 'edit' | 'settings') => void;
}

export function CommandMenu({ copy, onSelect }: CommandMenuProps) {
  const commands = [
    { id: 'edit' as const, label: copy.editShortcuts, hint: copy.manageOrbit },
    { id: 'settings' as const, label: copy.settings, hint: copy.searchAndGlass },
  ];

  return (
    <div className="command-menu" aria-label={copy.commands}>
      {commands.map((command) => (
        <button
          className="command-row"
          key={command.id}
          type="button"
          onClick={() => onSelect(command.id)}
        >
          <span>{command.label}</span>
          <small>{command.hint}</small>
        </button>
      ))}
    </div>
  );
}
