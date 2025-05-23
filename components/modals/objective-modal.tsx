import { ObjectiveModalClient } from "./objective-modal-client";
import { Objective, CreateObjectiveInput, UpdateObjectiveInput } from "@/types/objectives";

interface ObjectiveModalProps {
  objective?: Objective;
  title: string;
}

export function ObjectiveModal({ objective, title }: ObjectiveModalProps) {
  return (
    <ObjectiveModalClient
      isOpen={true}
      onClose={() => {}}
      onSubmit={async (data: CreateObjectiveInput | UpdateObjectiveInput) => {}}
      objective={objective}
      title={title}
    />
  );
}
