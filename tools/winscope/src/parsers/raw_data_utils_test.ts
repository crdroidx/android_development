/*
 * Copyright (C) 2024 The Android Open Source Project
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

import {assertDefined} from 'common/assert_utils';
import {PropertyTreeBuilder} from 'test/unit/property_tree_builder';
import {TreeNodeUtils} from 'test/unit/tree_node_utils';
import {RawDataUtils} from './raw_data_utils';

describe('RawDataUtils', () => {
  it('identifies color', () => {
    const color = TreeNodeUtils.makeColorNode(0, 0, 0, 1);
    expect(RawDataUtils.isColor(color)).toBeTrue();

    const colorOnlyA = TreeNodeUtils.makeColorNode(
      undefined,
      undefined,
      undefined,
      1,
    );
    expect(RawDataUtils.isColor(colorOnlyA)).toBeTrue();
  });

  it('identifies rect', () => {
    const rect = TreeNodeUtils.makeRectNode(0, 0, 1, 1);
    expect(RawDataUtils.isRect(rect)).toBeTrue();

    const rectLeftTop = TreeNodeUtils.makeRectNode(0, 0, undefined, undefined);
    expect(RawDataUtils.isRect(rectLeftTop)).toBeTrue();

    const rectRightBottom = TreeNodeUtils.makeRectNode(
      undefined,
      undefined,
      1,
      1,
    );
    expect(RawDataUtils.isRect(rectRightBottom)).toBeTrue();
  });

  it('identifies buffer', () => {
    const buffer = TreeNodeUtils.makeBufferNode();
    expect(RawDataUtils.isBuffer(buffer)).toBeTrue();
  });

  it('identifies size', () => {
    const size = TreeNodeUtils.makeSizeNode(0, 0);
    expect(RawDataUtils.isSize(size)).toBeTrue();
    expect(RawDataUtils.isBuffer(size)).toBeFalse();

    const sizeOnlyW = TreeNodeUtils.makeSizeNode(0, undefined);
    expect(RawDataUtils.isSize(sizeOnlyW)).toBeTrue();

    const sizeOnlyH = TreeNodeUtils.makeSizeNode(undefined, 0);
    expect(RawDataUtils.isSize(sizeOnlyH)).toBeTrue();

    const notSize = new PropertyTreeBuilder()
      .setRootId('test node')
      .setName('size')
      .setChildren([
        {name: 'w', value: 0},
        {name: 'h', value: 0},
        {name: 'x', value: 0},
        {name: 'y', value: 0},
      ])
      .build();

    expect(RawDataUtils.isSize(notSize)).toBeFalse();
  });

  it('identifies position', () => {
    const pos = TreeNodeUtils.makePositionNode(0, 0);
    expect(RawDataUtils.isPosition(pos)).toBeTrue();
    expect(RawDataUtils.isRect(pos)).toBeFalse();

    const posOnlyX = TreeNodeUtils.makePositionNode(0, undefined);
    expect(RawDataUtils.isPosition(posOnlyX)).toBeTrue();

    const posOnlyY = TreeNodeUtils.makePositionNode(undefined, 0);
    expect(RawDataUtils.isPosition(posOnlyY)).toBeTrue();

    const notPos = new PropertyTreeBuilder()
      .setRootId('test node')
      .setName('pos')
      .setChildren([
        {name: 'w', value: 0},
        {name: 'h', value: 0},
        {name: 'x', value: 0},
        {name: 'y', value: 0},
      ])
      .build();

    expect(RawDataUtils.isPosition(notPos)).toBeFalse();
  });

  it('identifies region', () => {
    const region = new PropertyTreeBuilder()
      .setRootId('test node')
      .setName('region')
      .setChildren([{name: 'rect', value: []}])
      .build();
    expect(RawDataUtils.isRegion(region)).toBeTrue();

    const rectNode = assertDefined(region.getChildByName('rect'));
    rectNode.addOrReplaceChild(
      TreeNodeUtils.makeRectNode(0, 0, 1, 1, rectNode.id),
    );
    rectNode.addOrReplaceChild(
      TreeNodeUtils.makeRectNode(0, 0, undefined, undefined, rectNode.id),
    );
    rectNode.addOrReplaceChild(
      TreeNodeUtils.makeRectNode(undefined, undefined, 1, 1, rectNode.id),
    );
    expect(RawDataUtils.isRegion(region)).toBeTrue();

    rectNode.addOrReplaceChild(TreeNodeUtils.makeColorNode(0, 0, 0, 0));
    expect(RawDataUtils.isRegion(region)).toBeFalse();
  });

  it('identifies non-empty color and rect', () => {
    const color = TreeNodeUtils.makeColorNode(0, 8, 0, 1);
    const rect = TreeNodeUtils.makeRectNode(0, 0, 1, 1);

    const isEmptyColor = RawDataUtils.isEmptyObj(color);
    const isEmptyRect = RawDataUtils.isEmptyObj(rect);
    expect(isEmptyColor).toBeFalse();
    expect(isEmptyRect).toBeFalse();
  });

  it('identifies empty color and rect', () => {
    const color = TreeNodeUtils.makeColorNode(-1, -1, undefined, 1);
    const rect = TreeNodeUtils.makeRectNode(0, 0, undefined, undefined);
    const otherColor = TreeNodeUtils.makeColorNode(1, 1, 1, 0);
    const otherRect = TreeNodeUtils.makeRectNode(0, 0, 0, 0);

    expect(RawDataUtils.isEmptyObj(color)).toBeTrue();
    expect(RawDataUtils.isEmptyObj(rect)).toBeTrue();
    expect(RawDataUtils.isEmptyObj(otherColor)).toBeTrue();
    expect(RawDataUtils.isEmptyObj(otherRect)).toBeTrue();
  });
});
