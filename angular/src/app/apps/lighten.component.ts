import { Component, OnInit, ViewChild } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { FormsModule } from '@angular/forms';

import { TextareaTwoComponent } from '../templates/textarea-two.component';
import { WasmLoaderLightenService } from '../wasm-loader-lighten.service';
import { DialogPopupComponent } from '../templates/dialog-popup.component';

import { EmbindModule as LightenModule } from '../../assets/web_lighten.js';

@Component({
  selector: 'app-lighten',
  imports: [
    TextareaTwoComponent,
    LucideAngularModule,
    FormsModule,
    DialogPopupComponent,
  ],
  templateUrl: './lighten.component.html',
  styleUrl: './lighten.component.css',
})
export class AppLightenComponent implements OnInit {
  lighten?: LightenModule;

  @ViewChild(TextareaTwoComponent) textareaTwo!: TextareaTwoComponent;

  count: number = 4;

  constructor(private wasmLoaderLighten: WasmLoaderLightenService) {
    this.lightenNumber = this.lightenNumber.bind(this);
  }

  async ngOnInit() {
    const count = localStorage.getItem('lighten-count');
    if (count) {
      this.count = Number(count);
    }

    await this.loadWasmLightenModule();
  }

  async loadWasmLightenModule() {
    if (!this.lighten) {
      this.lighten = await this.wasmLoaderLighten.wasm();
    }
  }

  roundNumbers(data: any): any {
    if (typeof data === 'number') {
      return Number(
        this.lighten!.web_lighten_number(data.toString(), this.count)
      );
    } else if (Array.isArray(data)) {
      return data.map(this.roundNumbers);
    } else if (typeof data === 'object' && data !== null) {
      const roundedObject: any = {};
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          roundedObject[key] = this.roundNumbers(data[key]);
        }
      }
      return roundedObject;
    }
    return data;
  }

  processJson(input: string): string {
    try {
      const parsedJson = JSON.parse(input);
      const roundedJson = this.roundNumbers(parsedJson);
      return JSON.stringify(roundedJson, null, 2);
    } catch (error) {
      return 'Invalid JSON input';
    }
  }

  async lightenNumber(input: string): Promise<string> {
    return this.processJson(input);
  }

  onCount(count: number) {
    this.count = count;

    localStorage.setItem('lighten-count', count.toString());

    const event = new Event('input', { bubbles: true });
    this.textareaTwo.inputElement.nativeElement.dispatchEvent(event);
  }
}
