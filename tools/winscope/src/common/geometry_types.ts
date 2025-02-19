/*
 * Copyright (C) 2023 The Android Open Source Project
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

export interface Point {
  x: number;
  y: number;
}

export interface TransformMatrix {
  dsdx: number;
  dtdx: number;
  tx: number;
  dsdy: number;
  dtdy: number;
  ty: number;
}

export const IDENTITY_MATRIX = {
  dsdx: 1,
  dtdx: 0,
  tx: 0,
  dsdy: 0,
  dtdy: 1,
  ty: 0,
};
