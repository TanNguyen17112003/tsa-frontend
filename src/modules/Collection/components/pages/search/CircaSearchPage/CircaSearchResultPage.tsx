import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { CollectionsApi } from "src/api/collections";
import { SutrasApi } from "src/api/sutras";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "src/components/shadcn/ui/accordion";
import { useCollectionCategoriesContext } from "src/contexts/collections/collection-categories-context";
import useFunction from "src/hooks/use-function";
import { Sutra } from "src/types/sutra";
import clsx from "clsx";
import { CustomTable } from "src/components/custom-table";
import getCircaSearchTableConfig from "src/sections/admin/circa-search/circa-search-table-config";
import { CircaSearchQuery } from "./CircaSearchForm";

const CircaSearchResultPage = ({ qCirca }: { qCirca?: CircaSearchQuery }) => {
  return;
  <></>;
};

export default CircaSearchResultPage;
