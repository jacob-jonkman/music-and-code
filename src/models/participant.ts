export interface Participant {
  condition?: number; // 1 for music, 2 for silence
  name?: string;
  start_times?: string[];
  end_times?: string[];
  durations?: number[];
  answers?: string[];
}

