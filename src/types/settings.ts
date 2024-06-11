export type Layout = "horizontal" | "vertical";

export type NavColor = "blend-in" | "discreet" | "evident";

export interface Settings {
  layout?: Layout;
  navColor?: NavColor;
  responsiveFontSizes?: boolean;
  stretch?: boolean;
}
