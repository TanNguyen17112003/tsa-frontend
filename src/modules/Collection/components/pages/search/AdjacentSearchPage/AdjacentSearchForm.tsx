import { useFormik } from "formik";
import { useRouter } from "next/router";
import { useMemo, type FC, useCallback, useEffect } from "react";
import CustomSelect from "src/components/CustomSelect/CustomSelect";
import { Button } from "src/components/shadcn/ui/button";
import { Input } from "src/components/shadcn/ui/input";
import FormInput from "src/components/ui/FormInput";
import searchTypes from "src/modules/Collection/constants/searchTypes";

interface AdjacentSearchFormProps {
  className: string;
}

const AdjacentSearchForm: FC<AdjacentSearchFormProps> = ({ className }) => {
  const router = useRouter();
  const currentSearchType = router.query.searchType;

  const handleChange = useCallback(
    (value: string) => {
      const newQuery: any = {};
      Object.keys(router.query).forEach((key) =>
        key.startsWith("q") ? null : (newQuery[key] = router.query[key])
      );
      router.replace({
        pathname: router.pathname,
        query: { ...newQuery, searchType: value },
      });
    },
    [router]
  );

  const acceptSearchTypes = useMemo(
    () =>
      searchTypes.filter((searchType) =>
        ["basic", "advance", "adjacent"].includes(searchType.value)
      ),
    []
  );

  const handleSubmit = useCallback(
    (value: any) => {
      const textSearch =
        value.pre_adjacent_word +
        "_" +
        value.pre_range +
        "_" +
        value.middle_word +
        "_" +
        value.next_adjacent_word +
        "_" +
        value.next_range;
      router.replace({
        pathname: router.pathname,
        query: { ...router.query, textSearch: textSearch },
      });
    },
    [router]
  );

  const formik = useFormik({
    initialValues: {
      pre_adjacent_word: "",
      pre_range: 5,
      middle_word: "",
      next_adjacent_word: "",
      next_range: 5,
    },
    onSubmit: handleSubmit,
  });

  useEffect(() => {
    if (router.query.textSearch) {
      const temp = (router.query.textSearch as string)?.split("_");
      formik.setValues({
        pre_adjacent_word: temp[0],
        pre_range: parseInt(temp[1]),
        middle_word: temp[2],
        next_adjacent_word: temp[3],
        next_range: parseInt(temp[4]),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  return (
    <form className={className}>
      <div className="gap-4 space-y-4">
        <div className="flex items-center border border-gray-300 rounded-md w-full divide-x">
          <div className="flex w-full items-center">
            <FormInput
              type="text"
              placeholder="Nhập từ khóa tìm kiếm..."
              className="border-none"
              {...formik.getFieldProps("middle_word")}
              error={formik.touched.middle_word && !!formik.errors.middle_word}
              helperText={
                !!formik.touched.middle_word && formik.errors.middle_word
              }
            />
          </div>
          <CustomSelect
            options={acceptSearchTypes}
            value={currentSearchType ? currentSearchType.toString() : ""}
            onValueChange={handleChange}
            className="border-none"
          />
        </div>
        <div className="flex items-center border border-gray-300 rounded-md w-full divide-x">
          <div className="flex w-full items-center">
            <FormInput
              type="text"
              placeholder="Nhập từ khóa tìm kiếm..."
              className="border-none"
              {...formik.getFieldProps("pre_adjacent_word")}
              error={
                formik.touched.pre_adjacent_word &&
                !!formik.errors.pre_adjacent_word
              }
              helperText={
                !!formik.touched.pre_adjacent_word &&
                formik.errors.pre_adjacent_word
              }
            />
          </div>
          <div>
            <Input
              type="number"
              className="w-12 border-none"
              defaultValue={5}
              {...formik.getFieldProps("pre_range")}
            ></Input>
          </div>
          <div>
            <Input
              type="text"
              className="flex border-none w-36 text-center"
              defaultValue={"Từ liền kề trước"}
              disabled
            />
          </div>
        </div>
        <div className="flex items-center border border-gray-300 rounded-md w-full divide-x">
          <div className="flex w-full items-center">
            <FormInput
              type="text"
              placeholder="Nhập từ khóa tìm kiếm..."
              className="border-none"
              {...formik.getFieldProps("next_adjacent_word")}
              error={
                formik.touched.next_adjacent_word &&
                !!formik.errors.next_adjacent_word
              }
              helperText={
                !!formik.touched.next_adjacent_word &&
                formik.errors.next_adjacent_word
              }
            />
          </div>
          <div>
            <Input
              type="number"
              className="w-12 border-none"
              defaultValue={5}
              {...formik.getFieldProps("next_range")}
            ></Input>
          </div>
          <div>
            <Input
              type="text"
              className="flex border-none w-36 text-center"
              defaultValue={"Từ liền kề sau"}
              disabled
            />
          </div>
        </div>
        <Button
          type="button"
          className="flex ml-auto"
          onClick={() => formik.handleSubmit()}
        >
          {" "}
          Tìm kiếm
        </Button>
      </div>
    </form>
  );
};

export default AdjacentSearchForm;
