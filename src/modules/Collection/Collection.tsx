import type { FC } from "react";
import CollectionCategoriesProvider from "src/contexts/collections/collection-categories-context";
import CollectionsProvider from "src/contexts/collections/collections-context";
import OrisonsProvider from "src/contexts/orisons/orisons-context";
import SutrasProvider from "src/contexts/sutras/sutras-context";
import VolumesProvider from "src/contexts/volumes/volumes-context";
import CollectionContent from "./CollectionContent";
import ReportsProvider from "src/contexts/reports/reports-context";

interface CollectionProps {}

const Collection: FC<CollectionProps> = ({}) => {
  return (
    <div className="h-[calc(100vh_-_116px)] relative overflow-y-auto pl-[300px] flex flex-col border-t">
      <CollectionCategoriesProvider>
        <CollectionsProvider>
          <SutrasProvider>
            <VolumesProvider>
              <OrisonsProvider>
                <ReportsProvider>
                  <CollectionContent />
                </ReportsProvider>
              </OrisonsProvider>
            </VolumesProvider>
          </SutrasProvider>
        </CollectionsProvider>
      </CollectionCategoriesProvider>
    </div>
  );
};

export default Collection;
