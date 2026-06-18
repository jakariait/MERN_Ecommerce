export function SectionHeader({
  title,
  description,
  action,
}) {
  return (
    <div className="border-b border-border pb-3 text-center">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-foreground">
          {title}
        </h1>

        {description && (
          <p className="mt-1.5 text-sm text-muted-foreground leading-normal">
            {description}
          </p>
        )}
      </div>

      {action && (
        <div className="mt-3 flex justify-center">{action}</div>
      )}
    </div>
  );
}
