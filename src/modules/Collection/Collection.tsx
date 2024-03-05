import type { FC } from "react";
import CollectionCategoriesProvider from "src/contexts/collections/collection-categories-context";
import CollectionsProvider from "src/contexts/collections/collections-context";
import OrisonsProvider from "src/contexts/orisons/orisons-context";
import SutrasProvider from "src/contexts/sutras/sutras-context";
import VolumesProvider from "src/contexts/volumes/volumes-context";
import CollectionContent from "./CollectionContent";

interface CollectionProps {}

const Collection: FC<CollectionProps> = ({}) => {
  return (
    <div className="h-[calc(100vh_-_116px)] relative overflow-y-auto pl-[300px] flex flex-col">
      <CollectionCategoriesProvider>
        <CollectionsProvider>
          <SutrasProvider>
            <VolumesProvider>
              <OrisonsProvider>
                <CollectionContent
                  sideNavClassName="fixed top-[116px] left-0 z-10"
                  className=""
                ></CollectionContent>
              </OrisonsProvider>
            </VolumesProvider>
          </SutrasProvider>
        </CollectionsProvider>
      </CollectionCategoriesProvider>
    </div>
  );
};

export default Collection;
