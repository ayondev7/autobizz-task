export default function Table({ children, className = "" }) {
  return (
    <div className="w-full overflow-auto">
      <table className={`w-full caption-bottom text-sm ${className}`}>
        {children}
      </table>
    </div>
  );
}

export function TableHeader({ children, className = "" }) {
  return <thead className={`border-b border-border ${className}`}>{children}</thead>;
}

export function TableBody({ children, className = "" }) {
  return <tbody className={`${className}`}>{children}</tbody>;
}

export function TableRow({ children, className = "", ...props }) {
  return (
    <tr
      className={`border-b border-border transition-colors hover:bg-muted/50 ${className}`}
      {...props}
    >
      {children}
    </tr>
  );
}

export function TableHead({ children, className = "", ...props }) {
  return (
    <th
      className={`h-12 px-4 text-left align-middle font-medium text-muted-foreground ${className}`}
      {...props}
    >
      {children}
    </th>
  );
}

export function TableCell({ children, className = "", ...props }) {
  return (
    <td className={`p-4 align-middle ${className}`} {...props}>
      {children}
    </td>
  );
}
