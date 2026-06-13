import { useEffect } from "react";

export const useDocumentTitle = (title: string, buildTitleWithBrand = true) => {
  useEffect(() => {
    if (buildTitleWithBrand) {
      document.title = `${title} | E-Asset`;
    } else {
      document.title = title;
    }
  }, [title, buildTitleWithBrand]);
};
