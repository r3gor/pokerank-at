import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { ActionIconProps, DefaultMantineColor } from "@mantine/core";

export interface TableAction<T> {
  icon: IconDefinition;
  handler: (i: T) => () => void;
  color?: DefaultMantineColor,
  label?: string,
}
