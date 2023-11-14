/*
 * Copyright (C) 2022 The Android Open Source Project
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import {CommonModule} from '@angular/common';
import {ChangeDetectionStrategy} from '@angular/core';
import {ComponentFixture, ComponentFixtureAutoDetect, TestBed} from '@angular/core/testing';
import {FormControl, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatDividerModule} from '@angular/material/divider';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatSliderModule} from '@angular/material/slider';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatTooltipModule} from '@angular/material/tooltip';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {assertDefined} from 'common/assert_utils';

import {Title} from '@angular/platform-browser';
import {FileUtils} from 'common/file_utils';
import {ViewerSurfaceFlingerComponent} from 'viewers/viewer_surface_flinger/viewer_surface_flinger_component';
import {AdbProxyComponent} from './adb_proxy_component';
import {AppComponent} from './app_component';
import {MatDrawer, MatDrawerContainer, MatDrawerContent} from './bottomnav/bottom_drawer_component';
import {CollectTracesComponent} from './collect_traces_component';
import {MiniTimelineComponent} from './timeline/mini-timeline/mini_timeline_component';
import {TimelineComponent} from './timeline/timeline_component';
import {TraceConfigComponent} from './trace_config_component';
import {TraceViewComponent} from './trace_view_component';
import {UploadTracesComponent} from './upload_traces_component';
import {WebAdbComponent} from './web_adb_component';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;
  let htmlElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [Title, {provide: ComponentFixtureAutoDetect, useValue: true}],
      imports: [
        CommonModule,
        FormsModule,
        MatCardModule,
        MatButtonModule,
        MatDividerModule,
        MatFormFieldModule,
        MatIconModule,
        MatSelectModule,
        MatSliderModule,
        MatSnackBarModule,
        MatToolbarModule,
        MatTooltipModule,
        ReactiveFormsModule,
        MatInputModule,
        BrowserAnimationsModule,
      ],
      declarations: [
        AdbProxyComponent,
        AppComponent,
        CollectTracesComponent,
        MatDrawer,
        MatDrawerContainer,
        MatDrawerContent,
        MiniTimelineComponent,
        TimelineComponent,
        TraceConfigComponent,
        TraceViewComponent,
        UploadTracesComponent,
        ViewerSurfaceFlingerComponent,
        WebAdbComponent,
      ],
    })
      .overrideComponent(AppComponent, {
        set: {changeDetection: ChangeDetectionStrategy.Default},
      })
      .compileComponents();
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    htmlElement = fixture.nativeElement;
    component.filenameFormControl = new FormControl(
      'winscope',
      Validators.compose([
        Validators.required,
        Validators.pattern(FileUtils.DOWNLOAD_FILENAME_REGEX),
      ])
    );
    fixture.detectChanges();
  });

  it('can be created', () => {
    expect(component).toBeTruthy();
  });

  it('has the expected title', () => {
    expect(component.title).toEqual('winscope');
  });

  it('renders the page title', () => {
    const title = assertDefined(htmlElement.querySelector('.app-title'));
    expect(title.innerHTML).toContain('Winscope');
  });

  it('displays correct elements when no data loaded', () => {
    component.dataLoaded = false;
    component.showDataLoadedElements = false;
    fixture.detectChanges();

    expect(htmlElement.querySelector('.welcome-info')).toBeTruthy();
    expect(htmlElement.querySelector('.trace-file-info')).toBeFalsy();
    expect(htmlElement.querySelector('.active')).toBeFalsy();
    expect(htmlElement.querySelector('.collect-traces-card')).toBeTruthy();
    expect(htmlElement.querySelector('.upload-traces-card')).toBeTruthy();
    expect(htmlElement.querySelector('.viewers')).toBeFalsy();
  });

  it('displays correct elements when data loaded', () => {
    component.dataLoaded = true;
    component.showDataLoadedElements = true;
    fixture.detectChanges();

    expect(htmlElement.querySelector('.welcome-info')).toBeFalsy();
    expect(htmlElement.querySelector('.trace-file-info')).toBeTruthy();
    expect(htmlElement.querySelector('.active')).toBeTruthy();
    expect(htmlElement.querySelector('.save-button')).toBeTruthy();
    expect(htmlElement.querySelector('.collect-traces-card')).toBeFalsy();
    expect(htmlElement.querySelector('.upload-traces-card')).toBeFalsy();
    expect(htmlElement.querySelector('.viewers')).toBeTruthy();
  });

  it('downloads traces on download button click', () => {
    component.showDataLoadedElements = true;
    fixture.detectChanges();
    const spy = spyOn(component, 'downloadTraces');

    clickDownloadTracesButton();
    expect(spy).toHaveBeenCalledTimes(1);

    clickDownloadTracesButton();
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('downloads traces after valid file name change', () => {
    component.showDataLoadedElements = true;
    fixture.detectChanges();
    const spy = spyOn(component, 'downloadTraces');

    clickEditFilenameButton();
    updateFilenameInputAndDownloadTraces('Winscope2', true);
    expect(spy).toHaveBeenCalledTimes(1);

    // check it works twice in a row
    clickEditFilenameButton();
    updateFilenameInputAndDownloadTraces('win_scope', true);
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('changes page title based on archive name', () => {
    component.onTraceDataUnloaded();
    const pageTitle = TestBed.inject(Title);
    expect(pageTitle.getTitle()).toBe('Winscope');

    component.tracePipeline.getDownloadArchiveFilename = jasmine
      .createSpy()
      .and.returnValue('test_archive');
    component.onTraceDataLoaded([]);
    fixture.detectChanges();
    expect(pageTitle.getTitle()).toBe('Winscope | test_archive');
  });

  it('does not download traces if invalid file name chosen', () => {
    component.showDataLoadedElements = true;
    fixture.detectChanges();
    const spy = spyOn(component, 'downloadTraces');

    clickEditFilenameButton();
    updateFilenameInputAndDownloadTraces('w?n$cope', false);
    expect(spy).not.toHaveBeenCalled();
  });

  it('behaves as expected when entering valid then invalid then valid file names', () => {
    component.showDataLoadedElements = true;
    fixture.detectChanges();

    const spy = spyOn(component, 'downloadTraces');

    clickEditFilenameButton();
    updateFilenameInputAndDownloadTraces('Winscope2', true);
    expect(spy).toHaveBeenCalled();

    clickEditFilenameButton();
    updateFilenameInputAndDownloadTraces('w?n$cope', false);
    expect(spy).toHaveBeenCalledTimes(1);

    updateFilenameInputAndDownloadTraces('win.scope', true);
    expect(spy).toHaveBeenCalledTimes(2);
  });

  const updateFilenameInputAndDownloadTraces = (name: string, valid: boolean) => {
    const inputEl = assertDefined(htmlElement.querySelector('.file-name-input-field input'));
    const checkButton = assertDefined(htmlElement.querySelector('.check-button'));
    (inputEl as HTMLInputElement).value = name;
    inputEl.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    checkButton.dispatchEvent(new Event('click'));
    fixture.detectChanges();
    if (valid) {
      expect(htmlElement.querySelector('.download-file-info')).toBeTruthy();
      clickDownloadTracesButton();
    } else {
      expect(htmlElement.querySelector('.save-button')).toBeFalsy();
      expect(htmlElement.querySelector('.download-file-info')).toBeFalsy();
    }
  };

  const clickDownloadTracesButton = () => {
    const downloadButton = assertDefined(htmlElement.querySelector('.save-button'));
    downloadButton.dispatchEvent(new Event('click'));
    fixture.detectChanges();
  };

  const clickEditFilenameButton = () => {
    const pencilButton = assertDefined(htmlElement.querySelector('.edit-button'));
    pencilButton.dispatchEvent(new Event('click'));
    fixture.detectChanges();
  };
});
