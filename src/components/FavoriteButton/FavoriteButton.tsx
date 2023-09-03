import React from "react";
import { Checkbox, CheckboxProps } from "@mantine/core";
import { ChangeEventHandler } from "react";
import { IconHeart, IconHeartFilled } from "@tabler/icons-react";

interface IconProps {
  indeterminate: boolean;
  className: string;
}

const CheckboxIcon: CheckboxProps["icon"] = ({
  indeterminate,
  className,
}: IconProps) =>
  indeterminate ? (
    <IconHeartFilled className={className} />
  ) : (
    <IconHeart className={className} />
  );

interface Props {
  checked: boolean;
  checkboxHandler: ChangeEventHandler<HTMLInputElement>;
}

const FavoriteButton = ({ checked, checkboxHandler }: Props) => {
  return (
    <Checkbox
      label="favorite"
      checked={checked}
      onChange={checkboxHandler}
      icon={CheckboxIcon}
      indeterminate
      size="xl"
      radius="xl"
      color="pink"
      sx={{
        color: "pink",
        input: { cursor: "pointer" },
        label: { cursor: "pointer" },
      }}
    />
  );
};

export default FavoriteButton;