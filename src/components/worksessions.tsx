import { useForm } from "react-hook-form";
import { trpc } from "../utils/trpc";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  StartSessionInputType,
  startSessionValidator,
} from "../shared/work-session-validator";

import { useEffect, useMemo, useState } from "react";

import { Prisma, WorkSession } from "@prisma/client";
import {
  getClockFromMilliseconds,
  getCurrentDate,
  getMillisecondsDifference,
} from "../utils/timespan";

import { useAutoAnimate } from "@formkit/auto-animate/react";
import { TrashIcon } from "@heroicons/react/outline";
import {
  ChevronDoubleRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  FireIcon,
  StopIcon,
} from "@heroicons/react/solid";
import Image from "next/image";
import { useQueryClient } from "react-query";
import LoadingSVG from "../assets/puff.svg";
import { groupBy } from "../utils/arrays";
import {
  datesAreOnSameDay,
  getEndOfDay,
  getStartOfDay,
} from "../utils/date-helper";
import { getTotalMilliseconds } from "../utils/worksessions";
import ClipboardTimer from "./clipboard-timer";

const workSessionWithWorkPhase = Prisma.validator<Prisma.WorkSessionArgs>()({
  include: { workPhase: true },
});
export type WorkSessionWithWorkPhase = Prisma.WorkSessionGetPayload<
  typeof workSessionWithWorkPhase
>;

const SessionElement = ({
  milliseconds,
  finished,
  sessionId,
  editMode,
  day,
}: {
  milliseconds: number;
  finished: boolean;
  sessionId: string;
  editMode: boolean;
  day: Date;
}): JSX.Element => {
  const qc = useQueryClient();

  const { mutate: finishWorkSession, isLoading: finishWorkSessionIsLoading } =
    trpc.useMutation(["worksessions.finish"], {
      onSuccess: (data: WorkSessionWithWorkPhase) => {
        qc.setQueryData(
          [
            "worksessions.get-sessions-after",
            { after: getStartOfDay(day), before: getEndOfDay(day) },
          ],
          (old: WorkSessionWithWorkPhase[] | undefined) => {
            if (!old) {
              return [data];
            }
            return old.map((x) => {
              return x.id === data.id ? data : x;
            });
          }
        );
      },
    });

  const { mutate: deleteWorkSession, isLoading: deleteWorkSessionIsLoading } =
    trpc.useMutation(["worksessions.delete"], {
      onSuccess: (data: WorkSession) => {
        qc.setQueryData(
          [
            "worksessions.get-sessions-after",
            { after: getStartOfDay(day), before: getEndOfDay(day) },
          ],
          (old: WorkSessionWithWorkPhase[] | undefined) => {
            if (!old) {
              return [];
            }
            return old.filter((x) => x.id !== data.id);
          }
        );
      },
    });

  const isMutating = finishWorkSessionIsLoading || deleteWorkSessionIsLoading;

  return (
    <div>
      <div
        className={`grid grid-cols-7 py-3 px-4 items-center bg-grey-500 group`}
      >
        {finished ? (
          <div className="col-span-1 text-grey-200 text-xs">Finished</div>
        ) : (
          <div className="col-span-1 flex justify-center items-center text-white bg-green-600 text-xs rounded-sm">
            <span className="py-[2px]">Active</span>
          </div>
        )}
        <div className="col-span-3"></div>
        <div className="col-span-2 font-sans">
          {getClockFromMilliseconds(milliseconds)}
        </div>
        {isMutating ? (
          <div className="flex animate-fade-in-delay justify-end">
            <Image src={LoadingSVG} alt="loading..." width={15} height={15} />
          </div>
        ) : finished ? (
          <TrashIcon
            onClick={() => deleteWorkSession({ id: sessionId })}
            className={`${
              editMode ? "block" : "hidden"
            } sm:hidden sm:group-hover:block hover:text-red-500 w-4 h-4 place-self-end self-center cursor-pointer text-red-400`}
          />
        ) : (
          <StopIcon
            onClick={() => finishWorkSession({ id: sessionId })}
            className="w-5 h-5 place-self-end self-center cursor-pointer"
          />
        )}
      </div>
    </div>
  );
};

const SessionsContainer = ({
  projectSessions,
  currentDate,
  editMode,
  day,
}: {
  projectSessions: WorkSessionWithWorkPhase[];
  currentDate: Date;
  editMode: boolean;
  day: Date;
}): JSX.Element => {
  const [sessionsContainer] = useAutoAnimate<HTMLDivElement>();

  return (
    <div ref={sessionsContainer}>
      {projectSessions.map((x, i) => {
        const endTime = x.finishTime ? x.finishTime : currentDate;

        return (
          <SessionElement
            key={x.id}
            milliseconds={getMillisecondsDifference(endTime, x.startTime)}
            sessionId={x.id}
            finished={x.finishTime ? true : false}
            editMode={editMode}
            day={day}
          />
        );
      })}
    </div>
  );
};

const SessionsGrid = ({
  sessionsByProject,
  currentDate,
  day,
}: {
  sessionsByProject: Record<string, WorkSessionWithWorkPhase[]>;
  currentDate: Date;
  day: Date;
}): JSX.Element => {
  const [parent] = useAutoAnimate<HTMLDivElement>();
  const [editMode, setEditMode] = useState<boolean>(false);
  return (
    <div className="mt-5 px-1">
      <div
        className={`${
          Object.keys(sessionsByProject).length > 0 ? "flex" : "hidden"
        } md:hidden justify-end pr-[1px] py-1`}
      >
        <label
          htmlFor="small-toggle"
          className="inline-flex relative items-center justify-end cursor-pointer"
        >
          <input
            type="checkbox"
            value=""
            id="small-toggle"
            className="sr-only peer"
            onClick={() => setEditMode((y) => !y)}
          />
          <div className="w-7 h-4 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          <span className="ml-1 text-xs font-medium text-grey-200">Edit</span>
        </label>
      </div>
      <div
        className="bg-grey-600 pt-2 text-sm grid grid-cols-1 md:grid-cols-2 gap-4"
        ref={parent}
      >
        {Object.keys(sessionsByProject).map((project: string, i) => {
          return (
            <div key={project} className="bg-grey-500 shadow-md">
              <div className="px-4 py-2 bg-grey-400 text-grey-100 flex justify-between items-center">
                <span>{sessionsByProject[project]?.at(0)?.workPhase.name}</span>
                <ClipboardTimer
                  clock={getClockFromMilliseconds(
                    getTotalMilliseconds(
                      currentDate,
                      sessionsByProject[project]
                    )
                  )}
                  clockClassName="text-blue-400 font-sans font-medium"
                />
              </div>

              <SessionsContainer
                projectSessions={sessionsByProject[project]!}
                currentDate={currentDate}
                editMode={editMode}
                day={day}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

const CreateSessionForm = ({
  day,
  isToday,
  sessionsByProject,
}: {
  day: Date;
  isToday: boolean;
  sessionsByProject: Record<string, WorkSessionWithWorkPhase[]>;
}): JSX.Element => {
  const { register, handleSubmit, control, formState, reset } =
    useForm<StartSessionInputType>({
      resolver: zodResolver(startSessionValidator),
      defaultValues: {
        startTime: new Date(),
      },
    });

  const qc = useQueryClient();

  const { mutate: createWorkSession, isLoading } = trpc.useMutation(
    ["worksessions.create"],
    {
      onSuccess: (data: WorkSessionWithWorkPhase) => {
        qc.setQueryData(
          [
            "worksessions.get-sessions-after",
            { after: getStartOfDay(day), before: getEndOfDay(day) },
          ],
          (old: WorkSessionWithWorkPhase[] | undefined) => {
            if (!old) {
              return [data];
            }
            return [...old, data];
          }
        );
      },
    }
  );

  const { data: workPhases } = trpc.useQuery(["workphases.get-all"], {
    onSuccess: () => {
      reset();
    },
  });

  const submitDisabled =
    !formState.isValid || formState.isSubmitting || isLoading || !isToday;

  console.log(sessionsByProject);
  return (
    <div>
      <form
        onSubmit={handleSubmit((data) => {
          if (
            sessionsByProject[data.workPhaseId]?.filter((x) => !x.finishTime)
              .length ??
            0 > 1
          ) {
            return;
          }
          createWorkSession({ ...data, startTime: getCurrentDate() });
        })}
        className="flex justify-between items-center gap-2 mt-2"
      >
        <select
          {...register("workPhaseId")}
          className="input w-full h-9 pl-3 rounded-xl bg-grey-700 text-grey-100 text-sm"
          defaultValue={0}
        >
          {workPhases &&
            workPhases.map((x) => {
              return (
                <option value={x.id} key={x.id}>
                  {x.name}
                </option>
              );
            })}
        </select>
        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={submitDisabled}
            className={`w-24 sm:w-32 h-8 bg-blue-500 rounded-md text-sm ${
              submitDisabled && "opacity-60"
            }`}
          >
            {isLoading ? (
              <div>
                <svg
                  aria-hidden="true"
                  role="status"
                  className="inline mr-3 w-4 h-4 text-white animate-spin"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="#E5E7EB"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentColor"
                  />
                </svg>
                <span>Loading...</span>
              </div>
            ) : (
              <span>Start</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

const WorkSessions = (): JSX.Element => {
  const [timerDate, setTimerDate] = useState(new Date());
  const [day, setDay] = useState(new Date());

  const isToday = datesAreOnSameDay(day, timerDate);

  const setPreviousDay = () => {
    setDay((oldDay) => {
      const newDay = new Date(oldDay);
      newDay.setDate(newDay.getDate() - 1);
      return newDay;
    });
  };

  const setNextDay = () => {
    // Dont allow switching to future days
    if (!isToday) {
      setDay((oldDay) => {
        const newDay = new Date(oldDay);
        newDay.setDate(newDay.getDate() + 1);
        return newDay;
      });
    }
  };

  const { data: workSessions, isLoading: workSessionsIsLoading } =
    trpc.useQuery(
      [
        "worksessions.get-sessions-after",
        { after: getStartOfDay(day), before: getEndOfDay(day) },
      ],
      {}
    );

  useEffect(() => {
    const interval = setInterval(() => {
      setTimerDate(new Date());
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const sessionsByProject: Record<string, WorkSessionWithWorkPhase[]> =
    useMemo(() => {
      return workSessions && workSessions.length > 0
        ? groupBy(workSessions, (x) => x.workPhaseId)
        : {};
    }, [workSessions]);

  const totalMillisecondsToday = getTotalMilliseconds(timerDate, workSessions);

  return (
    <div>
      <div className="flex flex-row justify-between items-center">
        <div className="flex gap-1 items-center justify-left">
          <FireIcon className="w-5 h-5" />
          <div className="select-none" onClick={() => setPreviousDay()}>
            <ChevronLeftIcon className="w-6 h-6 cursor-pointer" />
          </div>
          <div className="text-lg">
            <h2>{day.toLocaleDateString("de-DE")}</h2>
          </div>
          <div className="select-none" onClick={() => setNextDay()}>
            <ChevronRightIcon
              className={`w-6 h-6 cursor-pointer ${
                isToday ? "text-grey-300" : "text-white"
              }`}
            />
          </div>
          <div className="select-none" onClick={() => setDay(new Date())}>
            <ChevronDoubleRightIcon
              className={`ml-[-8px] w-5 h-5 cursor-pointer text-white ${
                isToday ? "hidden" : "block"
              }`}
            />
          </div>
        </div>
        <div className="text-center flex flex-row gap-1 sm:gap-2 items-center justify-center">
          <span className="text-grey-200 text-[10px] sm:text-xs">Total</span>
          <ClipboardTimer
            clock={getClockFromMilliseconds(totalMillisecondsToday)}
            clockClassName="text-grey-100 font-sans text-sm sm:text-base"
          />
        </div>
      </div>
      <div className="py-2"></div>
      <CreateSessionForm
        day={day}
        isToday={isToday}
        sessionsByProject={sessionsByProject}
      />
      {workSessionsIsLoading ? (
        <div className="flex animate-fade-in-delay justify-center mt-12">
          <Image src={LoadingSVG} alt="loading..." width={50} height={50} />
        </div>
      ) : (
        <SessionsGrid
          currentDate={timerDate}
          sessionsByProject={sessionsByProject}
          day={day}
        />
      )}
    </div>
  );
};

export default WorkSessions;
