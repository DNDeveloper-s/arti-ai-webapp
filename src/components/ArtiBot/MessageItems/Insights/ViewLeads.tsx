import { useFetchLeadsData, useQueryLeadsData } from "@/api/admanager";
import UiModal from "@/components/shared/renderers/UiModal";
import UiTable from "@/components/shared/renderers/UiTable";
import { IAd } from "@/interfaces/ISocial";
import {
  Button,
  ModalBody,
  ModalContent,
  ModalHeader,
  Progress,
  Spinner,
} from "@nextui-org/react";
import { useCallback, useContext, useMemo } from "react";
import { formatInsightName, handleDownload } from "./DeployAdInsightsCard";
import { MdDownload } from "react-icons/md";
import { SnackbarContext } from "@/context/SnackbarContext";

interface LeadsDataTableProps {
  ad: IAd;
}
function LeadsDataTable({ ad }: LeadsDataTableProps) {
  const {
    data: leadsPages,
    isFetching,
    isLoading,
    fetchStatus,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useQueryLeadsData("ad_entities", ad.id);
  const leads = leadsPages?.pages.map((page) => page.data).flat();

  const fetchNextPageFn = useCallback(() => {
    if (!isFetching && !isFetchingNextPage) fetchNextPage();
  }, [fetchNextPage, isFetching, isFetchingNextPage]);

  const leadTableRows = useMemo(() => {
    return leads?.reduce((acc, lead) => {
      const map = lead?.field_data?.reduce((acc, field) => {
        acc[field.name] = field.values.join(", ");
        return acc;
      }, {} as any);

      map.id = lead.id;
      acc.push(map);
      return acc;
    }, [] as any);
  }, [leads]);

  const columns = useMemo(() => {
    return (
      leads?.[0]?.field_data?.map((field) => ({
        name: formatInsightName(field.name),
        uid: field.name,
      })) ?? []
    );
  }, [leads]);

  console.log("Testing | leadTableRows - ", leadTableRows, columns);

  const hasColumns = columns.length > 0;

  return isLoading ? (
    <Spinner size="lg" />
  ) : (
    <div>
      {hasColumns && (
        <UiTable
          columns={columns}
          fetchStatus={fetchStatus}
          totalItems={leadTableRows ?? []}
          pronoun="campaign"
          emptyContent={isFetching ? "" : "No campaigns found"}
          isLoading={isLoading}
          fetchMore={fetchNextPageFn}
          hasMore={hasNextPage}
          selectionMode="none"
          noTopContent={true}
          classNames={{
            wrapper: "max-h-[80vh] h-full pb-10",
            td: "py-2",
          }}
        />
      )}
      {!hasColumns && (
        <p className="text-sm text-center my-5 text-gray-400">No leads found</p>
      )}
    </div>
  );
}

interface ViewLeadsProps {
  open: boolean;
  handleClose: () => void;
  ad: IAd;
}
export default function ViewLeads(props: ViewLeadsProps) {
  const { open, handleClose, ad } = props;
  const [, setSnackbarData] = useContext(SnackbarContext).snackBarData;
  const { mutate: fetchLeadsData, isPending: isLeadsDataFetching } =
    useFetchLeadsData<"ad_entities">({
      onSuccess: async (data, variables, context) => {
        try {
          await handleDownload(ad.name, {
            data: [
              {
                id: ad.id,
                name: ad.name,
                leads: data,
              },
            ],
            paging: {
              cursors: {
                before: "",
                after: "",
              },
            },
          });
          setSnackbarData(null);
        } catch (e: any) {
          setSnackbarData({
            message: e.message ?? "Failed to download data",
            status: "error",
          });
        }
      },
    });

  const { data: leadsPages } = useQueryLeadsData("ad_entities", ad.id);
  const leads = leadsPages?.pages.map((page) => page.data).flat();
  const hasNoLeads = leads?.length === 0;

  return (
    <UiModal
      keepMounted={false}
      isOpen={open}
      onClose={handleClose}
      isDismissable={false}
      isKeyboardDismissDisabled={true}
      classNames={{
        wrapper: "bg-black bg-opacity-50",
        base: "!max-w-[900px] !w-[90vw]",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex justify-between items-start pr-9 gap-1">
              <h2>Leads</h2>
              {!hasNoLeads && (
                <Button
                  startContent={<MdDownload className="text-sm" />}
                  color="primary"
                  isDisabled={isLeadsDataFetching}
                  disabled={isLeadsDataFetching}
                  className="rounded-sm"
                  size="sm"
                  onClick={() => {
                    setSnackbarData({
                      status: "progress",
                      message: "Downloading data...",
                    });
                    fetchLeadsData({
                      type: "ad_entities",
                      id: ad?.id,
                    });
                  }}
                >
                  Download
                </Button>
              )}
            </ModalHeader>
            <ModalBody>
              <LeadsDataTable ad={ad} />
            </ModalBody>
          </>
        )}
      </ModalContent>
    </UiModal>
  );
}
