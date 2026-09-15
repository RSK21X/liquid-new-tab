interface CommandMenuProps {
  onSelect: (command: 'edit' | 'settings') => void;
}

const commands = [
  { id: 'edit' as const, label: 'Edit shortcuts', hint: 'Manage your orbit' },
  { id: 'settings' as const, label: 'Settings', hint: 'Search and glass' },
];

export function CommandMenu({ onSelect }: CommandMenuProps) {
  return (
    <div className="command-menu" aria-label="Commands">
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
