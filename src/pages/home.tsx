import { FC, ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { SortBy, SortOrder, useGetTasksQuery } from "../store/api/taskApi";
import { TaskList } from "../components/task/taskList";
import Styles from "@/styles/home.module.scss";
import { TaskI } from "../types/task";
import clsx from "clsx";
import { ClipLoader } from "react-spinners";

interface Sort {
  value: SortBy;
  title: string;
}

interface CompletedFilterList {
  value?: TaskI["completed"];
  title: string;
}

interface PriorityFilterList {
  value?: TaskI["priority"];
  title: string;
}

export const Home: FC = () => {
  // Список для сортировки задач
  const sortList: Sort[] = [
    {
      title: "Дата добовления",
      value: "id",
    },
    {
      title: "Выполненность",
      value: "completed",
    },
    {
      title: "Приоритет",
      value: "priority",
    },
    {
      title: "Название",
      value: "title",
    },
  ];

  // Список фильтров по выполненности задач
  const completedFilterList: CompletedFilterList[] = [
    {
      title: "Все",
      value: undefined, // Это означает, что все задачи будут показаны
    },
    {
      title: "Выполненные",
      value: true,
    },
    {
      title: "Невыполненные",
      value: false,
    },
  ];

  // Список фильтров по приоритету задач
  const priorityFilterList: PriorityFilterList[] = [
    {
      title: "Все",
      value: undefined, // Это означает, что все приоритеты будут показаны
    },
    {
      title: "Отсутствует",
      value: "none", // Это означает, что все приоритеты будут показаны
    },
    {
      title: "Высокий",
      value: "high",
    },
    {
      title: "Средний",
      value: "medium",
    },
    {
      title: "Низкий",
      value: "low",
    },
  ];

  // Состояния для страницы, сортировки, фильтров
  const [page, setPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [sortBy, setSortBy] = useState<SortBy>("id");
  const [completedFilter, setCompletedFilter] = useState<
    TaskI["completed"] | undefined
  >(undefined);
  const [priorityFilter, setPriorityFilter] = useState<
    TaskI["priority"] | undefined
  >(undefined);

  // Функция для переключения порядка сортировки
  const toggleSortOrder = () => {
    if (sortOrder == "asc") {
      setSortOrder("desc");
    } else {
      setSortOrder("asc");
    }
  };

  // Функция для установки сортировки (с учетом смены порядка)
  const setSort = (sort: SortBy) => {
    if (sort === sortBy) {
      toggleSortOrder();
    } else {
      setSortBy(sort);
      setSortOrder("asc");
    }
  };

  // Запрос для получения задач с учетом фильтров и сортировки
  const { data, isLoading, isFetching, isError } = useGetTasksQuery({
    page,
    sortBy,
    completed: completedFilter,
    priority: priorityFilter,
  });

  // Сортируем задачи, если необходимо (переворачиваем их при "desc")
  let tasks = data?.data;

  if (tasks && sortOrder == "desc") {
    tasks = [...tasks].reverse();
  }

  // Проверка на наличие следующих задач для загрузки
  const hasMore = data?.next !== null;

  // Функция для загрузки следующей страницы с задачами
  const loadMore = useCallback(() => {
    if (!isFetching && hasMore) {
      setPage((prev) => prev + 1);
      window.scrollTo(0, 0);
    }
  }, [hasMore, isFetching]);

  // Ссылка для отслеживания нажатия на элемент для подгрузки данных
  const observerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore(); // Загружаем следующую страницу данных
        }
      },
      { threshold: 1.0 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current); // Наблюдаем за элементом для подгрузки
    }

    return () => {
      if (observerRef.current) {
        observer.disconnect(); // Отключаем наблюдатель при размонтировании компонента
      }
    };
  }, [observerRef, hasMore, data, loadMore]);

  // Отображение ошибки при неудачном запросе
  if (isError) return <div>Error</div>;

  return (
    <div className={Styles.content}>
      <div className={Styles.settings}>
        <div>
          <h3>фильтр</h3>
          <div>
            <h4> Выполненность </h4>
            <div className={Styles.selectList}>
              {completedFilterList.map((filter) => (
                <SelectButton
                  key={filter.title}
                  active={filter.value == completedFilter}
                  onClick={() => setCompletedFilter(filter.value)}
                >
                  {filter.title}
                </SelectButton>
              ))}
            </div>
          </div>
          <div>
            <h4> Приоритет </h4>
            <div className={Styles.selectList}>
              {priorityFilterList.map((filter) => (
                <SelectButton
                  key={filter.value}
                  active={filter.value == priorityFilter}
                  onClick={() => setPriorityFilter(filter.value)}
                >
                  {filter.title}
                </SelectButton>
              ))}
            </div>
          </div>
        </div>
        <div>
          <h3>сортировка</h3>

          <div className={Styles.selectList}>
            {sortList.map((sort) => (
              <SelectButton
                key={sort.title}
                active={sort.value == sortBy}
                onClick={() => setSort(sort.value)}
              >
                <div className={Styles.sortSelectButton}>
                  <div>{sort.title}</div>
                  <div>
                    {sortOrder === "asc" && sort.value == sortBy ? (
                      <div>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          viewBox="0 0 16 16"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708z"
                          />
                        </svg>
                      </div>
                    ) : (
                      <div>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          viewBox="0 0 16 16"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708"
                          />
                        </svg>{" "}
                      </div>
                    )}
                  </div>
                </div>
              </SelectButton>
            ))}
          </div>
        </div>
      </div>
      <div className={Styles.pageCount}>
        <a href="#" onClick={() => setPage((page) => page - 1)}>
          {"<"}
        </a>
        <input
          className={Styles.count}
          value={page}
          type="number"
          onChange={(e) => setPage(parseInt(e.currentTarget.value, 10))}
        />
        <a href="#" onClick={() => setPage((page) => page + 1)}>
          {">"}
        </a>
      </div>
      {isLoading || isFetching ? (
        <div className={Styles.spinerWrapper}>
          <ClipLoader color="#ffa116" size={100} />
        </div>
      ) : data && page > data?.last ? (
        <div> Задачи кончились </div>
      ) : (
        <div className="">{tasks && <TaskList tasks={tasks} />}</div>
      )}

      <div ref={observerRef}></div>
    </div>
  );
};

// Компонент для отображения кнопки фильтра/сортировки
const SelectButton: FC<{
  active: boolean;
  children: ReactNode;
  onClick: () => void;
}> = ({ active, children, onClick }) => {
  return (
    <a
      className={clsx(Styles.selectButton, active && Styles.selectButtonActive)}
      onClick={() => onClick()}
      href="#"
    >
      {children}
    </a>
  );
};
