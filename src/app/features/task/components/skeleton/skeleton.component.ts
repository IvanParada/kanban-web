import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgClass } from '@angular/common';

type SkeletonColumn = {
  bgClass: string;
  cards: number;
};

@Component({
  selector: 'app-skeleton',
  imports: [NgClass],
  templateUrl: './skeleton.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkeletonComponent {
  columns: SkeletonColumn[] = [
    { bgClass: 'bg-base-200/60', cards: 2 },
    { bgClass: 'bg-info/10', cards: 3 },
    { bgClass: 'bg-warning/10', cards: 2 },
    { bgClass: 'bg-success/10', cards: 2 },
  ];

  range(n: number): number[] {
    return Array.from({ length: n }, (_, i) => i);
  }
}
