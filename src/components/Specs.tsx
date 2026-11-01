import { Fragment } from "react";

interface SpecItem {
  label: string;
  value: string;
  dateTime?: string;
}

interface SpecsProps {
  items: SpecItem[];
}

export function Specs({ items }: SpecsProps) {
  return (
    <section aria-labelledby="specs-title">
      <h2 id="specs-title">Характеристики</h2>
      <dl className="specs">
        {items.map((item) => (
          <Fragment key={item.label}>
            <dt>{item.label}</dt>
            <dd>{item.dateTime ? <time dateTime={item.dateTime}>{item.value}</time> : item.value}</dd>
          </Fragment>
        ))}
      </dl>
    </section>
  );
}
