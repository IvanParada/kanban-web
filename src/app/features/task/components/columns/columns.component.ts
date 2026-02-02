import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgClass } from '@angular/common';
import { DragDropModule, CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';
import { CardComponent } from "../card/card.component";
import { Task } from "../../interfaces/task.models";
import { CreateTaskComponent } from "../create-task/create-task.component";

export type ColumnId = 'TODO' | 'PENDING' | 'IN_PROGRESS' | 'DONE';

@Component({
  selector: 'app-columns',
  imports: [DragDropModule, CdkDropList, CardComponent, NgClass, CreateTaskComponent],
  templateUrl: './columns.component.html',
})
export class ColumnsComponent {
  @Input({ required: true }) id!: ColumnId;
  @Input({ required: true }) title!: string;
  @Input({ required: true }) badgeClass!: string;
  @Input({ required: true }) bgClass!: string;
  @Input({ required: true }) titleClass!: string;
  @Input({ required: true }) tasks: Task[] = [];
  @Input() connectedTo: ColumnId[] = ['TODO', 'PENDING', 'IN_PROGRESS', 'DONE'];

  @Output() dropped = new EventEmitter<{ event: CdkDragDrop<Task[]>; column: ColumnId }>();

  @Output() taskCreated = new EventEmitter<Task>();
  @Output() taskSelected = new EventEmitter<Task>();

  onTaskSelected(task: Task) {
    this.taskSelected.emit(task);
  }

  onDrop(event: CdkDragDrop<Task[]>) {
    this.dropped.emit({ event, column: this.id });
  }
}
